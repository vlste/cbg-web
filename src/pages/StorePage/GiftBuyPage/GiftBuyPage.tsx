import { Page } from "@/components/page/Page";
import type { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { publicUrl } from "@/helpers/publicUrl";
import { useGiftStore } from "@/stores/giftStore";
import {
  hapticFeedback,
  mainButton,
  openTelegramLink,
} from "@telegram-apps/sdk-react";
import { useTabbar } from "@/hooks/useTabbar";
import { Spinner } from "@/components/spinner/Spinner";
import { Lottie } from "@/components/lottie/Lottie";
import { useTranslation } from "react-i18next";
import { API, BASE_URL, GiftRecentActionResponse } from "@/api/api";
import { TokenIcon } from "@/components/icons/TokenIcon";
import { Img } from "@/components/img/Img";
import { cn } from "@/helpers/utils";
import { PaperplaneIcon } from "@/components/icons/PaperplaneIcon";
import { MarketIcon } from "@/components/icons/MarketIcon";
import { useInterval } from "@/hooks/useInterval";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { useAppStore } from "@/stores/appStore";

const RecentActionRow: FC<
  { action: GiftRecentActionResponse; isLast?: boolean }
> = (
  { action, isLast },
) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateToProfile = useCallback(
    (telegramId: string | undefined | number) => {
      if (!telegramId) return;
      hapticFeedback.selectionChanged();
      navigate(`/leaderboard/profile/${telegramId}`);
    },
    [navigate],
  );

  return (
    <div className="flex items-center gap-3 py-2 mb-2 relative animate-fade-in">
      <div className="relative">
        <Img
          src={`${BASE_URL}/tg/user/${action.actor?.telegramId}/photo`}
          alt="User"
          className="w-[40px] h-[40px] rounded-full"
        />
        <div
          className={cn(
            "absolute -bottom-[4px] -right-[4px] w-[20px] h-[20px] rounded-full border-2 border-white dark:border-[#1C1C1E] flex items-center justify-center text-white",
            action.type === "gift_purchased" && "bg-primary",
            action.type === "gift_sent" && "bg-accent-green",
          )}
        >
          {action.type === "gift_sent" && <PaperplaneIcon size={12} />}
          {action.type === "gift_purchased" && <MarketIcon size={10} />}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-[13px] text-[#8E8E93]">
          {action.type === "gift_sent" && t("action.description.send")}
          {action.type === "gift_purchased" && t("action.description.purchase")}
        </span>
        <div className="flex items-center gap-1 font-[510]">
          {action.type === "gift_sent" && (
            <>
              <span
                className="text-primary"
                onClick={() => navigateToProfile(action.actor?.telegramId)}
              >
                {action.actor?.firstName}
              </span>
              <span className="text-black dark:text-white">
                {t("action.sentGiftTo")}
              </span>
              <span
                className="text-primary"
                onClick={() => navigateToProfile(action.target?.telegramId)}
              >
                {action.target?.firstName}
              </span>
            </>
          )}
          {action.type === "gift_purchased" && (
            <>
              <span
                className="text-primary"
                onClick={() => navigateToProfile(action.actor?.telegramId)}
              >
                {action.actor?.firstName}
              </span>
              <span className="text-black dark:text-white">
                {t("action.purchasedGift")}
              </span>
            </>
          )}
        </div>
      </div>
      {!isLast && (
        <div className="h-[0.5px] ml-[53px] w-[calc(100%-53px)] bg-black/15 dark:bg-white/15 absolute bottom-0">
        </div>
      )}
    </div>
  );
};

export const GiftBuyPage: FC = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView();
  const gift = useGiftStore((state) => state.selectedGift);
  const { hide, show } = useTabbar();
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const [waitingForPayment, setWaitingForPayment] = useState<string | null>(
    null,
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["recentActions", gift?.id],
    queryFn: (pageParam) => {
      if (!gift) return;
      return API.getGiftRecentActions(gift.id, pageParam.pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data.pagination.pages &&
          lastPage?.data.pagination.pages > pages.length
        ? pages.length + 1
        : undefined;
    },
    enabled: !!gift,
  });

  const mainButtonClick = useCallback(async () => {
    if (!gift || processing) return;
    if (paymentUrl) {
      openTelegramLink(paymentUrl + "&mode=compact");
      return;
    }
    mainButton.setParams({
      isLoaderVisible: true,
    });
    try {
      setProcessing(true);
      const response = await API.buyGift(gift.id);
      if (response.status === 200) {
        setPaymentUrl(response.data.paymentUrl);
        setWaitingForPayment(response.data.invoiceId);
        openTelegramLink(response.data.paymentUrl + "&mode=compact");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        mainButton.setParams({
          isLoaderVisible: false,
        });
        setProcessing(false);
      }, 2000);
    }
  }, [gift, processing, paymentUrl]);

  useEffect(() => {
    mainButton.onClick(mainButtonClick);

    return () => {
      mainButton.offClick(mainButtonClick);
    };
  }, [mainButtonClick]);

  useEffect(() => {
    hide();
    setTimeout(() => {
      mainButton.setParams({
        text: "Buy a Gift",
        isLoaderVisible: false,
        hasShineEffect: true,
        isVisible: true,
      });
    }, 250);
  }, [hide]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const checkPayment = useCallback(async () => {
    if (!waitingForPayment) return;
    const response = await API.checkPayment(waitingForPayment);
    if (response.status === 200 && response.data.status === "paid") {
      setWaitingForPayment(null);
      navigate("/event", {
        state: {
          event: {
            type: "purchased",
            gift: gift,
            price: gift?.price,
          },
        },
      });
    }
  }, [waitingForPayment]);

  useInterval(checkPayment, waitingForPayment ? 1000 : null);

  const scrollRestorationRef = useRef<HTMLDivElement>(null);
  // useScrollRestoration(scrollRestorationRef);

  const {
    objectSourceRect,
    objectAnimating,
    setObjectAnimating,
    setObjectSourceRect,
  } = useAppStore();

  useEffect(() => {
    return () => {
      setObjectAnimating(false);
    };
  }, [setObjectAnimating]);

  useEffect(() => {
    setTimeout(() => {
      setObjectSourceRect(null);
    }, 1000);
  }, []);

  if (!gift) return null;

  const isPending = status === "pending";
  const isError = status === "error";
  const isEmpty = data?.pages.length === 0 && !isPending && !isError;

  return (
    <Page tabbar={false} ref={scrollRestorationRef}>
      <div className="relative z-10 flex flex-col p-4 animate-in-page transform-gpu">
        <div className="flex flex-col items-start">
          <div
            className={`bg-cover w-full aspect-square flex items-center justify-center mb-3 card-gradient-${
              (gift.bgVariant % 5) + 1
            } dark:card-gradient-${(gift.bgVariant % 4) + 1}`}
            style={{
              borderRadius: "16px",
            }}
          >
            <motion.div
              className="mb-4"
              initial={objectSourceRect !== null
                ? {
                  position: "fixed",
                  top: objectSourceRect
                    ? objectSourceRect.top + window.scrollY -
                      (objectSourceRect.height * 0.2)
                    : 0,
                  left: objectSourceRect
                    ? objectSourceRect.left + window.scrollX -
                      (objectSourceRect.width * 0.2)
                    : 0,
                  width: objectSourceRect?.width ?? "auto",
                  height: objectSourceRect?.height ?? "auto",
                  transform: "scale(0.4)",
                  transformOrigin: "center",
                  zIndex: 100,
                }
                : false}
              animate={{
                top: window.innerWidth / 5,
                left: "calc(50% - 125px)",
                width: "250px",
                height: "250px",
                transform: "translate(0, 0) scale(1)",
                transformOrigin: "center",
                zIndex: 1,
              }}
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              onAnimationComplete={() => setObjectAnimating(false)}
            >
              <Lottie
                src={publicUrl(`lotties/${gift.slug}.lottie`)}
                autoResize
                style={{
                  width: "250px",
                  height: "250px",
                  display: "block",
                }}
              />
            </motion.div>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <motion.h1 className="text-[24px] font-[590] text-black dark:text-white">
              {gift.name}
            </motion.h1>
            <motion.span className="text-[#007AFF] text-[14px] rounded-full bg-[rgba(0,122,255,0.1)] px-2 py-[2px] font-[500]">
              {gift.boughtCount} {t("common.of")} {gift.totalCount}
            </motion.span>
          </div>

          <motion.p className="text-[17px] text-[#8E8E93] mb-3">
            {t("store.buy.description")}
          </motion.p>

          <motion.div className="flex items-center gap-2 text-black dark:text-white font-[510] text-[17px] mb-4">
            <TokenIcon token={gift.price.token} bg />
            {gift.price.amount} {gift.price.token}
          </motion.div>
          <motion.div className="bg-bg-secondary dark:bg-black h-3 w-[calc(100%+32px)] -mx-4" />
        </div>

        <div className="mt-6">
          <h2 className="text-[13px] text-[#8E8E93] uppercase mb-2">
            {t("common.recentActions")}
          </h2>

          {isPending
            ? (
              <motion.div
                className="flex justify-center p-4 mt-2"
                animate={{
                  opacity: [0.5, 1, 0.5],
                  transition: {
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut",
                  },
                }}
              >
                <Spinner className="w-4 h-4" />
              </motion.div>
            )
            : isError
            ? (
              <div className="flex justify-center p-4">
                <span className="text-red-500">
                  {t("common.error")}
                </span>
              </div>
            )
            : data
            ? (
              <>
                {data.pages.map((page, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {page?.data.data.map((
                      action: GiftRecentActionResponse,
                      index: number,
                    ) => (
                      <RecentActionRow
                        key={action.id}
                        action={action}
                        isLast={index === page.data.data.length - 1 &&
                          i === data.pages.length - 1}
                      />
                    ))}
                  </motion.div>
                ))}

                <div
                  ref={ref}
                  className="flex justify-center mt-8 mb-3"
                >
                  {isFetchingNextPage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Spinner className="w-4 h-4" />
                    </motion.div>
                  )}
                </div>
              </>
            )
            : null}
        </div>
      </div>
    </Page>
  );
};
