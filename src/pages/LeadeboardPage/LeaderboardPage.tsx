import { API, BASE_URL, ProfileResponse } from "@/api/api";
import { Page } from "@/components/page/Page";
import { useInfiniteQuery } from "@tanstack/react-query";
import { motion, useInView } from "framer-motion";
import type { FC } from "react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@/components/spinner/Spinner";
import { Img } from "@/components/img/Img";
import { useTranslation } from "react-i18next";
import { useAppStore } from "@/stores/appStore";

const GiftSmallSVG = () => (
  <svg
    width="11"
    height="12"
    viewBox="0 0 11 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      id="Vector"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.30697 0.0202197C2.55043 0.125025 1.91988 0.703557 1.71935 1.47685C1.6152 1.87852 1.70206 2.44563 1.92084 2.79234C1.97195 2.87332 2.03868 2.98431 2.06915 3.03899L2.12452 3.1384L1.41178 3.13485C1.01977 3.13289 0.750043 3.14013 0.812407 3.15098L0.925796 3.17066L0.748257 3.19375C0.432355 3.23479 0.122265 3.48965 0.0356074 3.77944C-0.00977651 3.93123 -0.0126963 5.62453 0.032149 5.7914C0.0705595 5.93432 0.252294 6.14387 0.405936 6.22241C0.464416 6.25231 0.598924 6.28932 0.704858 6.30466C0.816574 6.32085 1.75847 6.33281 2.94817 6.33312L4.9989 6.33369L4.98918 4.77154L4.97945 3.2094H5.51028H6.04114L6.04049 4.76444L6.03984 6.31949H8.21682H10.3938L10.5419 6.25237C10.6966 6.1823 10.8958 5.99126 10.9534 5.85772C10.9994 5.75106 11.0189 4.07403 10.9768 3.845C10.9403 3.6466 10.8387 3.49269 10.6471 3.34579C10.4385 3.18583 10.3197 3.1668 9.52919 3.1668C9.14721 3.1668 8.86657 3.162 8.90555 3.15615C8.96287 3.14754 8.96695 3.14206 8.92698 3.12743C8.88346 3.11153 8.88981 3.0923 8.97968 2.96767C9.32781 2.48474 9.41798 1.88204 9.2282 1.30671C9.05922 0.79436 8.6166 0.317652 8.14624 0.141328C7.6014 -0.0629146 6.88116 -0.0440553 6.41521 0.186687C6.11297 0.33634 5.78486 0.670554 5.63144 0.98497C5.56908 1.11278 5.50986 1.21821 5.49988 1.21929C5.48987 1.22034 5.46036 1.16783 5.43431 1.10256C5.36231 0.922257 5.1141 0.5787 4.95309 0.436431C4.76778 0.272747 4.4095 0.0953446 4.15738 0.0424874C3.97485 0.00422911 3.51016 -0.00795561 3.30697 0.0202197ZM3.5298 1.07785C3.21682 1.12681 2.90642 1.38167 2.82492 1.65658C2.71303 2.03405 2.80204 2.47704 3.0428 2.74096C3.32828 3.05396 3.64725 3.13507 4.5259 3.11817L4.95111 3.10999L4.94357 2.66975C4.93444 2.139 4.89929 1.85281 4.82533 1.70756C4.74349 1.54686 4.36951 1.17436 4.32988 1.21409C4.32075 1.22321 4.31329 1.21614 4.31329 1.19836C4.31329 1.11701 3.79199 1.03686 3.5298 1.07785ZM7.01274 1.07972C6.79081 1.11216 6.58226 1.22764 6.40002 1.4191C6.11405 1.71949 6.045 1.96787 6.04335 2.70222C6.04262 3.0299 6.04939 3.09238 6.08732 3.10696C6.11198 3.11644 6.38423 3.1242 6.69234 3.1242C7.17498 3.1242 7.2749 3.1165 7.41408 3.0685C7.671 2.97994 7.85384 2.86684 7.98744 2.71378C8.15911 2.51718 8.2105 2.35236 8.20928 2.00229C8.20815 1.66956 8.15738 1.52479 7.97615 1.3377C7.84023 1.19736 7.67893 1.12142 7.43132 1.08117C7.22929 1.04831 7.22776 1.04831 7.01274 1.07972ZM4.1207 3.17364C4.22527 3.17907 4.40386 3.17913 4.51756 3.1737C4.63129 3.1683 4.55153 3.17775 4.33326 3.17772C4.11498 3.17766 4.01616 3.16819 4.1207 3.17364ZM2.27938 7.00825L0.769886 7.01586V8.87458C0.769886 10.1178 0.780233 10.7831 0.801097 10.8838C0.882056 11.274 1.17103 11.6733 1.48279 11.8258C1.75467 11.9587 1.83084 11.9646 3.45579 11.9775L4.99363 11.9897L4.99332 9.59484C4.99314 8.27767 4.98509 7.15205 4.97543 7.09346L4.95785 6.98695L4.37336 6.99379C4.0519 6.99757 3.10961 7.00407 2.27938 7.00825ZM6.02368 7.80335C6.03397 8.23694 6.04239 9.35856 6.04239 10.2958L6.04245 12L7.56611 11.9836C9.28585 11.9652 9.31721 11.9617 9.63727 11.7528C9.85218 11.6125 9.97965 11.463 10.095 11.2161C10.226 10.9355 10.2406 10.6715 10.2316 8.7337L10.2237 7.02955L8.11435 7.02228L6.005 7.01498L6.02368 7.80335Z"
      fill="#007AFF"
    />
  </svg>
);

const LeaderboardRow: FC<{ row: ProfileResponse; onClick: () => void }> = ({
  row,
  onClick,
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);

  const {
    objectSourceRect,
    objectAnimating,
    setObjectSourceRect,
    setObjectAnimating,
  } = useAppStore();

  return (
    <div
      className="flex items-center gap-3 py-2 mb-2 relative animate-fade-in"
      onClick={() => {
        setObjectSourceRect(ref.current?.getBoundingClientRect() ?? null);
        setObjectAnimating(true);
        onClick();
      }}
    >
      <div ref={ref} className="relative">
        <Img
          src={`${BASE_URL}/tg/user/${row.telegramId}/photo`}
          alt="User"
          className="w-[40px] h-[40px] rounded-full bg-bg-secondary dark:bg-[#2C2C2E]"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[17px] font-[500] text-black dark:text-white">
          {row.firstName}
        </span>
        <div className="flex items-center gap-1">
          <GiftSmallSVG />
          <span className="text-primary font-[400] text-[13px] mt-[2px]">
            {t("leaderboard.giftsReceived", {
              count: row.giftsReceived,
            })}
          </span>
        </div>
      </div>
      <div className="h-[0.5px] ml-[53px] w-[calc(100%-53px)] bg-black/15 dark:bg-white/15 absolute bottom-0">
      </div>
      <div className="absolute right-0">
        {row.rank === 1 && <span className="text-[22px]">🥇</span>}
        {row.rank === 2 && <span className="text-[22px]">🥈</span>}
        {row.rank === 3 && <span className="text-[22px]">🥉</span>}
        {row.rank !== 1 && row.rank !== 2 && row.rank !== 3 && (
          <span className="text-[15px] font-[510] text-label-secondary">
            #{row.rank}
          </span>
        )}
      </div>
    </div>
  );
};

export const LeaderboardPage: FC = () => {
  const navigate = useNavigate();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: [`leaderboard`],
    queryFn: (pageParam) => {
      return API.getLeaderboard(pageParam.pageParam);
    },
    initialPageParam: 1,
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

  return (
    <Page back={false}>
      <div className="flex flex-col p-4 animate-in-page">
        {isPending
          ? (
            <div className="flex justify-center p-4">
              <Spinner className="w-4 h-4" />
            </div>
          )
          : isError
          ? (
            <div className="flex justify-center p-4">
              <span className="text-red-500 text-center">
                Error loading leaderboard
              </span>
            </div>
          )
          : isEmpty
          ? (
            <div className="flex justify-center p-4">
              <span className="text-label-secondary text-center">
                No users found
              </span>
            </div>
          )
          : (
            <>
              {data?.pages.map((page) =>
                page.data.data.map((row, index) => (
                  <LeaderboardRow
                    key={index}
                    row={row}
                    onClick={() => {
                      navigate(`/leaderboard/profile/${row.telegramId}`);
                    }}
                  />
                ))
              )}
              {isFetchingNextPage && (
                <div className="flex justify-center mt-8 mb-3">
                  <Spinner className="w-4 h-4" />
                </div>
              )}
            </>
          )}
      </div>
    </Page>
  );
};
