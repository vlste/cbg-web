import { Page } from "@/components/page/Page";
import { useScrollRestoration } from "@/hooks/useScrollRestoration";
import { type FC, useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { mainButton } from "@telegram-apps/sdk-react";
import { useTabbar } from "@/hooks/useTabbar";
import { GiftStoreCard } from "@/components/gift-card/GiftStoreCard";
import { GiftIcon } from "@/components/icons/GiftIcon";
import { useAppStore } from "@/stores/appStore";
import { useTranslation } from "react-i18next";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/spinner/Spinner";
import { Fragment } from "react";
import { API } from "@/api/api";

export const StorePage: FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  useScrollRestoration(containerRef);
  const appLoaded = useAppStore((state) => state.loaded);
  const setLoaded = useAppStore((state) => state.setLoaded);
  const { show } = useTabbar();
  const { scrollY } = useScroll({
    container: containerRef,
  });
  const scale = useTransform(scrollY, [0, 200], [1, 0.7]);
  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery({
    queryKey: ["store-gifts"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.getStoreGifts(pageParam);
      return {
        gifts: response.data.data,
        hasMore: pageParam < response.data.pagination.pages,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined;
    },
  });

  const isSuccess = status === "success";
  const isError = status === "error";
  const isPending = status === "pending";

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    show();
    mainButton.setParams({
      isVisible: false,
    });
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <Page ref={containerRef} back={false}>
      <div className="flex flex-col p-4 animate-in-page transform-gpu">
        <motion.div
          className="flex flex-col items-center mt-2"
          style={{ scale }}
        >
          <GiftIcon className="text-primary" />
          <h1 className="text-center text-[24px] font-[590] text-black dark:text-white mt-4">
            {t("store.title")}
          </h1>
          <p className="text-center text-[17px] font-[400] text-label-secondary mt-2">
            {t("store.description")}
          </p>
        </motion.div>
        <div className="mt-8">
          <div className="flex flex-wrap gap-4 justify-between">
            {isSuccess && (
              data?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.gifts.map((gift, i) => (
                    <GiftStoreCard key={gift.id} index={i + 1} gift={gift} />
                  ))}
                </Fragment>
              ))
            )}
            {isError && (
              <div className="flex justify-center w-full p-4">
                <span className="text-red-500">{t("common.error")}</span>
              </div>
            )}
          </div>
          <div ref={ref} className="flex justify-center mt-8 mb-3">
            {(isPending || isFetchingNextPage) && (
              <Spinner className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>
    </Page>
  );
};
