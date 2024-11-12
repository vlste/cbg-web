/* eslint-disable react/prop-types */
import { Page } from "@/components/page/Page";
import { Spinner } from "@/components/spinner/Spinner";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { useEffect } from "react";
import groupBy from "lodash.groupby";
import { useTranslation } from "react-i18next";
import { PaperplaneIcon } from "@/components/icons/PaperplaneIcon";
import { MarketIcon } from "@/components/icons/MarketIcon";
import { publicUrl } from "@/helpers/publicUrl";
import { API, ProfileRecentActionResponse } from "@/api/api";
import { useAppStore } from "@/stores/appStore";
import { Img } from "@/components/img/Img";

const ActionRow: React.FC<{ action: ProfileRecentActionResponse }> = ({
  action,
}) => {
  const { t } = useTranslation();

  const Badge = () => {
    const color = action.type === "gift_purchased"
      ? "bg-primary"
      : action.type === "gift_sent"
      ? "bg-accent-purple"
      : "bg-accent-green";
    return (
      <div
        className={`text-white absolute bottom-0 right-0 translate-x-[3px] translate-y-[3px] w-[20px] h-[20px] ${color} rounded-full border-[2px] border-white dark:border-[#1c1c1c] flex items-center justify-center`}
      >
        {action.type === "gift_sent" && <PaperplaneIcon size={12} />}
        {/* {action.type === "gift_received" && <BoxIcon size={10} />} */}
        {action.type === "gift_purchased" && <MarketIcon size={10} />}
      </div>
    );
  };
  return (
    <div className="relative flex items-center py-2">
      <div className="relative flex items-center w-[40px] h-[40px] bg-bg-secondary dark:bg-[#2C2C2E] rounded-[10px]">
        <Img
          src={publicUrl(`thumbnail/${action.gift.slug}.png`)}
          className="w-10 h-10 rounded-full"
          alt=""
        />
        <Badge />
      </div>
      <div className="ml-[12px] flex-grow">
        <div className="text-[13px] font-[400] text-label-secondary">
          {action.type === "gift_sent" && "Sent"}
          {/* {action.type === "gift_received" && "Received"} */}
          {action.type === "gift_purchased" && "Bought"}
        </div>
        <div className="text-[17px] font-[500] text-black dark:text-white">
          {action.gift.name}
        </div>
      </div>
      <div className="text-[15px] font-[510] text-black dark:text-white">
        {
          /* {action.type === "gift_received" && (
          <div className="">
            from <span className="text-primary">{action.actor.name}</span>
          </div>
        )} */
        }
        {action.type === "gift_sent" && (
          <div className="">
            to <span className="text-primary">{action.target?.firstName}</span>
          </div>
        )}
        {action.type === "gift_purchased" && (
          <div className="">
            -{action.purchaseMetadata?.price.amount}{" "}
            {action.purchaseMetadata?.price.token}
          </div>
        )}
      </div>
      <div className="h-[0.5px] ml-[53px] w-[calc(100%-53px)] bg-black/15 dark:bg-white/15 absolute bottom-0">
      </div>
    </div>
  );
};

export const RecentActionsPage: React.FC = () => {
  const { ref, inView } = useInView();
  const { profile } = useAppStore();
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["recentActions"],
    queryFn: (pageParam) => {
      if (!profile) return null;
      return API.getProfileRecentActions(
        profile.telegramId.toString(),
        pageParam.pageParam,
      );
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data.pagination.pages &&
          lastPage?.data.pagination.pages > pages.length
        ? pages.length + 1
        : undefined;
    },
    enabled: !!profile,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allActions = data?.pages.flatMap((page) => page?.data.data) ?? [];
  const groupedActions = groupBy(allActions, (action) => {
    if (!action) return "";
    const date = new Date(action.createdAt);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return (
    <Page>
      <div className="flex flex-col justify-center py-4 px-4">
        <div className="text-[24px] font-[590] text-black dark:text-white w-full text-center mb-2 mt-2">
          {t("profile.recentActions.title")}
        </div>
        <div className="text-[17px] font-[400] text-label-secondary w-full text-center mb-6">
          {t("profile.recentActions.description")}
        </div>

        {status === "pending"
          ? (
            <div className="flex justify-center p-4">
              <Spinner className="w-4 h-4" />
            </div>
          )
          : status === "error"
          ? (
            <div className="flex justify-center p-4">
              <span className="text-red-500">Error loading actions</span>
            </div>
          )
          : (
            <>
              {Object.entries(groupedActions).map(([date, dateActions]) => (
                <motion.div
                  key={date}
                  className="mb-6"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-[13px] font-[400] text-label-date mb-2 uppercase">
                    {date}
                  </div>
                  <div className="divide-gray-200 dark:divide-gray-700">
                    {dateActions.map((action, index) => (
                      action && (
                        <ActionRow key={`${date}-${index}`} action={action} />
                      )
                    ))}
                  </div>
                </motion.div>
              ))}

              <div ref={ref} className="flex justify-center mt-8 mb-3">
                {isFetchingNextPage && <Spinner className="w-4 h-4" />}
              </div>
            </>
          )}
      </div>
    </Page>
  );
};
