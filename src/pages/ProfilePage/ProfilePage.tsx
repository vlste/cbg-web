import { Avatar } from "@/components/avatar/Avatar";
import { GiftPlainCard } from "@/components/gift-card/GiftPlainCard";
import { Page } from "@/components/page/Page";
import { Spinner } from "@/components/spinner/Spinner";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { type FC, Fragment, useEffect, useState } from "react";
import { ClockIcon } from "@/components/icons/ClockIcon";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { DayIcon } from "@/components/icons/DayIcon";
import { NightIcon } from "@/components/icons/NightIcon";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";
import { useNavigate } from "react-router-dom";
import { hapticFeedback, initDataState } from "@telegram-apps/sdk-react";
import { useTabbar } from "@/hooks/useTabbar";
import { USDTIcon } from "@/components/icons/USDTIcon";
import { InfoTable } from "@/components/info-table/InfoTable";
import { Lottie } from "@/components/lottie/Lottie";
import { SparkleCanvas } from "@/components/sparkles/SparkleCanvas";
import { publicUrl } from "@/helpers/publicUrl";
import { BottomSheet } from "@/components/sheet/BottomSheet";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { API, BASE_URL } from "@/api/api";
import { Skeleton } from "@/components/skeleton/Skeleton";
import {
  avatarUrl,
  formatDateWithTime,
  oneLetterAvatar,
} from "@/helpers/utils";
import { TokenIcon } from "@/components/icons/TokenIcon";

export const ProfilePage: FC = () => {
  const { t, i18n } = useTranslation();
  const { ref, inView } = useInView();
  const { show, hide } = useTabbar();

  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any>(null);

  const { initData } = useAppStore();
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: () => {
      const userId = initData?.user?.id;
      if (!userId) return null;
      return API.getProfile(userId.toString());
    },
    enabled: !!initData?.user?.id,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["gifts"],
    queryFn: (pageParam) => {
      const userId = initData?.user?.id;
      if (!userId) return null;
      return API.getProfileReceivedGifts(
        userId.toString(),
        pageParam.pageParam,
      );
    },
    initialPageParam: 1,
    enabled: !!initData?.user?.id,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data.pagination.pages &&
          lastPage?.data.pagination.pages > pages.length
        ? pages.length + 1
        : undefined;
    },
  });

  const isError = status === "error";
  const isSuccess = status === "success";
  const isPending = status === "pending";
  const isEmpty = data?.pageParams.length === 1 &&
    data?.pages[0]?.data.data.length === 0 &&
    isSuccess;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "ru">(
    i18n.language === "ru" ? "ru" : "en",
  );

  const { theme, setTheme } = useAppStore();

  const navigate = useNavigate();

  useEffect(() => {
    hapticFeedback.impactOccurred("light");
    if (isBottomSheetOpen) {
      hide();
    } else {
      show();
    }
  }, [isBottomSheetOpen]);

  const handleLanguageChange = (value: string) => {
    const newLang = value as "en" | "ru";
    setSelectedLanguage(newLang);
    i18n.changeLanguage(newLang);
    hapticFeedback.selectionChanged();
  };

  const bottomSheetContent = selectedGift && (
    <div className="flex flex-col pt-4">
      <div className="flex flex-col items-center mb-6 relative">
        <div className="relative w-full">
          <SparkleCanvas />
          <div className="relative z-10">
            <Lottie
              key={selectedGift.slug}
              src={publicUrl(`lotties/${selectedGift.slug}.lottie`)}
            />
          </div>
        </div>
        <h2 className="text-[24px] font-[600] mb-1 text-black dark:text-white">
          {t("action.sendGift")}
        </h2>
      </div>

      <InfoTable
        rows={[
          {
            title: t("common.from"),
            content: (
              <div className="flex items-center gap-2">
                <Avatar
                  src={avatarUrl(selectedGift.buyer.telegramId)}
                  style={{ width: 20, height: 20 }}
                />
                <span
                  className="text-[17px] font-[500] text-primary"
                  onClick={() => {
                    hapticFeedback.selectionChanged();
                    setIsBottomSheetOpen(false);
                    setTimeout(() => {
                      navigate(
                        `/leaderboard/profile/${selectedGift.buyer.telegramId}`,
                      );
                    }, 300);
                  }}
                >
                  {selectedGift.buyer.firstName}
                </span>
              </div>
            ),
          },
          {
            title: t("common.date"),
            content: formatDateWithTime(selectedGift.createdAt).replace(
              ", ",
              ` ${t("common.at")} `,
            ),
          },
          {
            title: t("common.price"),
            content: (
              <span className="flex items-center gap-1">
                <TokenIcon token={selectedGift.price.token} bg />
                {selectedGift.price.amount} {selectedGift.price.token}
              </span>
            ),
          },
          {
            title: t("common.availability"),
            content: `${
              Math.max(
                0,
                selectedGift.totalCount - selectedGift.boughtCount,
              )
            } ${t("common.of")} ${selectedGift.totalCount}`,
          },
        ]}
      />
    </div>
  );

  const rank = Number(profile?.data.rank || 0);

  return (
    <Page
      back={false}
      style={{ overflow: isBottomSheetOpen ? "hidden" : "auto" }}
    >
      <div className="flex flex-col items-center py-4 px-4 animate-in-page">
        <div className="w-full flex justify-between items-center">
          <SegmentedControl
            onChange={(value) => {
              setTheme(value as "light" | "dark");
              hapticFeedback.selectionChanged();
            }}
            segments={[
              { value: "light", icon: <DayIcon /> },
              { value: "dark", icon: <NightIcon /> },
            ]}
            value={theme}
          />
          <SegmentedControl
            onChange={handleLanguageChange}
            segments={[
              { value: "en", label: "EN" },
              { value: "ru", label: "RU" },
            ]}
            value={selectedLanguage}
          />
        </div>

        {isProfileLoading
          ? (
            <>
              <Skeleton className="w-[100px] h-[100px] rounded-full mb-5 mt-[-30px]" />
              <Skeleton className="w-[120px] h-[24px] mb-2" />
              <Skeleton className="w-[80px] h-[17px]" />
            </>
          )
          : (
            <>
              <Avatar
                src={`${BASE_URL}/tg/user/${initData?.user?.id}/photo`}
                badge={{
                  text: rank > 0 ? `#${rank}` : "",
                  color: profile?.data.rank === 1
                    ? "bg-[#F1AA05]"
                    : profile?.data.rank === 2
                    ? "bg-[#B3B3B3]"
                    : profile?.data.rank === 3
                    ? "bg-[#F78B50]"
                    : "label-secondary",
                }}
                placeholder={oneLetterAvatar(
                  initData?.user?.firstName || "",
                  100,
                )}
                style={{ marginBottom: 20, marginTop: -30 }}
              />
              <div className="flex flex-col items-center">
                <motion.div
                  transition={{ duration: 0.2 }}
                  layout
                  className="text-[24px] font-[600] text-black dark:text-white"
                >
                  {profile?.data.firstName}
                </motion.div>
                <motion.div
                  transition={{ duration: 0.07 }}
                  layout
                  className="text-[17px] font-[400] text-label-secondary"
                >
                  {profile?.data.giftsReceived === 0
                    ? t("profile.noGiftsReceived")
                    : `${profile?.data.giftsReceived} ${
                      t("profile.giftsReceived")
                    }`}
                </motion.div>
              </div>
            </>
          )}

        <motion.div
          transition={{ duration: 0.07 }}
          layout
          className="flex flex-row items-center gap-1 mt-[25px] mb-6 cursor-pointer"
          onClick={() => {
            navigate("/profile/recent-actions");
          }}
          whileTap={{
            scale: 0.95,
          }}
        >
          <ClockIcon />
          <span className="text-[17px] font-[400] text-primary cursor-pointer">
            {t("common.recentActions")} ›
          </span>
        </motion.div>

        {isEmpty && (
          <EmptyState
            description={t("profile.emptyStateDescription")}
            buttonTitle={t("profile.emptyStateButtonTitle")}
            onButtonClick={() => {
              navigate("/");
            }}
          />
        )}

        <div className="grid grid-cols-3 gap-2 w-full max-w-3xl">
          {isSuccess && (
            data?.pages.map((page, i) => (
              <Fragment key={i}>
                {page?.data.data.map((gift) => (
                  <GiftPlainCard
                    key={gift.id}
                    gift={gift}
                    onSelect={() => {
                      setSelectedGift(gift);
                      setIsBottomSheetOpen(true);
                    }}
                  />
                ))}
              </Fragment>
            ))
          )}
        </div>

        {isError && (
          <div className="flex justify-center p-4">
            <span className="text-red-500 text-center">
              {t("profile.errorLoading")}
            </span>
          </div>
        )}

        <div ref={ref} className="flex justify-center mt-8 mb-3">
          {(isPending || isFetchingNextPage) && <Spinner className="w-4 h-4" />}
        </div>
      </div>
      {
        /* <AnimatePresence>
        {isBottomSheetOpen && ( */
      }
      <BottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      >
        {bottomSheetContent}
      </BottomSheet>
      {
        /* )}
      </AnimatePresence> */
      }
    </Page>
  );
};
