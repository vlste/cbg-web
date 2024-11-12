/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchasedGiftResponse } from "@/api/api";
import { GiftInventoryCard } from "@/components/gift-card/GiftInventoryCard";
import { USDTIcon } from "@/components/icons/USDTIcon";
import { InfoTable } from "@/components/info-table/InfoTable";
import { Lottie } from "@/components/lottie/Lottie";
import { Page } from "@/components/page/Page";
import { BottomSheet } from "@/components/sheet/BottomSheet";
import { SparkleCanvas } from "@/components/sparkles/SparkleCanvas";
import { publicUrl } from "@/helpers/publicUrl";
import { useTabbar } from "@/hooks/useTabbar";
import {
  backButton,
  hapticFeedback,
  mainButton,
  switchInlineQuery,
} from "@telegram-apps/sdk-react";
import type { FC } from "react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/spinner/Spinner";
import { Fragment } from "react";
import { API } from "@/api/api";
import { formatDate, formatDateWithTime } from "@/helpers/utils";
import { TokenIcon } from "@/components/icons/TokenIcon";
import { EmptyState } from "@/components/empty-state/EmptyState";
import { useNavigate } from "react-router-dom";

export const GiftsPage: FC = () => {
  const { t } = useTranslation();
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { ref, inView } = useInView();
  const [isSendingGift, setIsSendingGift] = useState(false);
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["inventory-gifts"],
    queryFn: (pageParam) => {
      return API.getMyGifts(pageParam.pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.data.pagination.pages > pages.length
        ? pages.length + 1
        : undefined;
    },
  });

  const isSuccess = status === "success";
  const isError = status === "error";
  const isPending = status === "pending";
  const isEmpty = data?.pages.length === 1 &&
    data?.pages[0].data.data.length === 0 &&
    isSuccess;

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const { show, hide } = useTabbar();

  useEffect(() => {
    hapticFeedback.impactOccurred("light");
    if (isBottomSheetOpen) {
      hide();
      backButton.show();
      backButton.onClick(() => setIsBottomSheetOpen(false));
      mainButton.setParams({
        isVisible: true,
        text: t("action.sendGift"),
      });
    } else {
      backButton.onClick(() => {});
      backButton.hide();
      setTimeout(() => {
        mainButton.setParams({
          isVisible: false,
        });
        show();
      }, 200);
    }
  }, [isBottomSheetOpen]);

  const handleSendGift = useCallback(async () => {
    console.log("send gift", selectedGift);

    if (!selectedGift || isSendingGift) return;

    setIsSendingGift(true);
    mainButton.setParams({
      isLoaderVisible: true,
    });

    try {
      const response = await API.sendGift(selectedGift.id);
      if (response.data.sendToken) {
        if (switchInlineQuery.isSupported()) {
          switchInlineQuery(`${response.data.sendToken}`, ["users"]);
        } else {
          mainButton.setParams({
            isVisible: true,
            text: "Not supported. Open app via bot.",
          });
          setTimeout(() => {
            mainButton.setParams({
              isVisible: true,
              text: t("action.sendGift"),
            });
          }, 1000);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSendingGift(false);
      mainButton.setParams({
        isLoaderVisible: false,
      });
    }
  }, [selectedGift, isSendingGift]);

  useEffect(() => {
    mainButton.onClick(handleSendGift);
    return () => {
      mainButton.offClick(handleSendGift);
    };
  }, [handleSendGift]);

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
            title: t("common.gift"),
            content: selectedGift.name,
          },
          {
            title: t("common.date"),
            content: formatDateWithTime(selectedGift.boughtAt).replace(
              ", ",
              ` ${t("common.at")} `,
            ),
          },
          {
            title: t("common.price"),
            content: (
              <span className="flex items-center gap-2 text-[17px]">
                <span className="text-[#40B7AE]">
                  <TokenIcon token={selectedGift.price.token} bg />
                </span>
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

  return (
    <Page
      back={false}
      style={{ overflow: isBottomSheetOpen ? "hidden" : "auto" }}
    >
      <div className="relative">
        <div className="flex flex-col items-center px-4 py-8 text-center animate-in-page">
          <h1 className="text-[24px] font-[590] mb-2 text-black dark:text-white">
            {t("gifts.title")}
          </h1>
          <p className="text-[17px] text-[#8E8E93] mb-8">
            {t("gifts.description")}
          </p>

          {isEmpty && (
            <EmptyState
              description={t("gifts.emptyStateDescription")}
              buttonTitle={t("gifts.emptyStateButtonTitle")}
              onButtonClick={() => {
                navigate("/");
              }}
            />
          )}

          <div className="grid grid-cols-3 gap-2 w-full max-w-3xl">
            {isSuccess && (
              data?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.data.data.map((gift) => (
                    <GiftInventoryCard
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
            {(isPending || isFetchingNextPage) && (
              <Spinner className="w-4 h-4" />
            )}
          </div>
        </div>
        {
          <BottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
          >
            {bottomSheetContent}
          </BottomSheet>
        }
      </div>
    </Page>
  );
};
