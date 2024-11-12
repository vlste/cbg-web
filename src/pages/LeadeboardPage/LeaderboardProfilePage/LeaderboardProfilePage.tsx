import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { Spinner } from "@/components/spinner/Spinner";
import { GiftPlainCard } from "@/components/gift-card/GiftPlainCard";
import { Page } from "@/components/page/Page";
import { Fragment, useEffect, useRef } from "react";
import { Avatar } from "@/components/avatar/Avatar";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { API, BASE_URL } from "@/api/api";
import { oneLetterAvatar } from "@/helpers/utils";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { mainButton } from "@telegram-apps/sdk-react";
import { useAppStore } from "@/stores/appStore";

export const LeaderboardProfilePage: React.FC = () => {
  const { ref, inView } = useInView();
  const { t } = useTranslation();
  const { id: profileId } = useParams();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", profileId],
    queryFn: () => {
      if (!profileId) {
        return null;
      }
      return API.getProfile(profileId);
    },
    enabled: !!profileId,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`leaderboard-profile-${profileId}`],
    queryFn: (pageParam) => {
      if (!profileId) {
        return null;
      }
      return API.getProfileReceivedGifts(profileId, pageParam.pageParam);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      return lastPage?.data.pagination.pages &&
          lastPage?.data.pagination.pages > pages.length
        ? pages.length + 1
        : undefined;
    },
  });

  const {
    objectSourceRect,
    objectAnimating,
    setObjectSourceRect,
    setObjectAnimating,
  } = useAppStore();

  useEffect(() => {
    mainButton.setParams({
      isVisible: false,
    });
  }, []);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const currentContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setObjectSourceRect(null);
    }, 1000);
  }, [objectSourceRect]);

  return (
    <Page>
      <div className="flex flex-col items-center py-4 px-4 animate-in-page">
        <motion.div
          ref={currentContainerRef}
          initial={objectSourceRect
            ? {
              position: "relative",
              top: (objectSourceRect?.top ?? 0) - 50,
              left: -(window.innerWidth / 2 - 20) +
                (objectSourceRect?.left ?? 0),
              transform: "scale(0.4)",
            }
            : false}
          animate={{
            position: "relative",
            top: 0,
            left: 0,
            transform: "scale(1)",
            transition: {
              duration: 0.33,
              type: "spring",
            },
          }}
        >
          <Avatar
            src={`${BASE_URL}/tg/user/${profileId}/photo`}
            badge={{
              text: profile?.data.rank ? `#${profile?.data.rank}` : "",
              color: profile?.data.rank === 1
                ? "bg-[#F1AA05]"
                : profile?.data.rank === 2
                ? "bg-[#B3B3B3]"
                : profile?.data.rank === 3
                ? "bg-[#F78B50]"
                : "label-secondary",
            }}
            placeholder={oneLetterAvatar(
              profile?.data.firstName || "",
              100,
            )}
            style={{ marginBottom: 20 }}
          />
        </motion.div>
        <div className="flex flex-col items-center">
          {isProfileLoading
            ? <Skeleton className="w-full h-[24px] mb-2" />
            : (
              <div className="text-[24px] font-[600] text-black dark:text-white animate-in-page">
                {profile?.data.firstName}
              </div>
            )}
          {isProfileLoading
            ? <Skeleton className="w-full h-[17px] mb-2" />
            : (
              <div className="text-[17px] font-[400] text-label-secondary animate-in-page">
                {profile?.data.giftsReceived === 0
                  ? t("profile.noGiftsReceived")
                  : `${profile?.data.giftsReceived} ${
                    t("profile.giftsReceived")
                  }`}
              </div>
            )}
        </div>
        <div className="grid grid-cols-3 gap-2 w-full max-w-3xl mt-6">
          {status === "error"
            ? (
              <div className="flex justify-center p-4">
                <span className="text-red-500">{t("common.error")}</span>
              </div>
            )
            : status === "success"
            ? (
              data?.pages.map((page, i) => (
                <Fragment key={i}>
                  {page?.data.data.map((gift) => (
                    <GiftPlainCard
                      key={gift.id}
                      gift={gift}
                      onSelect={() => {}}
                    />
                  ))}
                </Fragment>
              ))
            )
            : <></>}
        </div>
        <div ref={ref} className="flex justify-center mt-8 mb-3">
          {(status === "pending" || isFetchingNextPage) && (
            <Spinner className="w-4 h-4" />
          )}
        </div>
      </div>
    </Page>
  );
};
