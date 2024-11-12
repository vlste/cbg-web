import { publicUrl } from "@/helpers/publicUrl";
import { useGiftStore } from "@/stores/giftStore";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { type FC, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Lottie } from "@/components/lottie/Lottie";
import { useTranslation } from "react-i18next";
import { StoreGiftResponse } from "@/api/api";
import { TokenIcon } from "../icons/TokenIcon";
import { useAppStore } from "@/stores/appStore";

export const GiftStoreCard: FC<{ index: number; gift: StoreGiftResponse }> = ({
  index,
  gift,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setSelectedGift = useGiftStore((state) => state.setSelectedGift);
  const selectedGift = useGiftStore((state) => state.selectedGift);

  const lottieContainerRef = useRef<HTMLDivElement>(null);
  const { setObjectSourceRect, setObjectAnimating } = useAppStore();

  const handleClick = () => {
    setSelectedGift(gift);
    hapticFeedback.selectionChanged();
    setObjectSourceRect(
      lottieContainerRef.current?.getBoundingClientRect() ?? null,
    );
    setObjectAnimating(true);
    navigate(`/store/gifts/${gift.id}`);
  };

  return (
    <div
      className="w-[calc(50%-8px)] h-[246px] relative rounded-xl animate-in-card"
      onClick={handleClick}
    >
      <div
        className={`absolute inset-0 bg-cover card-gradient-${
          (gift.bgVariant % 5) + 1
        }`}
        style={{
          borderRadius: "12px",
        }}
      />

      <div className="relative h-full p-4 flex flex-col justify-end items-center z-10">
        <div className="absolute top-[8px] right-[12px]">
          <h1 className="text-[12px] text-black/50 dark:text-white/50 font-[400]">
            {gift.boughtCount} {t("common.of")} {gift.totalCount}
          </h1>
        </div>
        <div
          ref={lottieContainerRef}
          className="flex items-center justify-center mb-3 animate-in-lottie"
        >
          <Lottie
            src={publicUrl(`lotties/${gift.slug}.lottie`)}
            style={{ width: "100px", height: "100px" }}
          />
        </div>

        <h3 className="text-black dark:text-white font-[var(--gifts-font-weight-2)] text-center mb-3">
          {gift.name}
          {/* <span /> */}
        </h3>

        {/* <p className="text-[13px] text-black/50 dark:text-white/50" /> */}

        <button className="flex flex-row items-center gap-0 bg-[var(--gifts-button-color-primary)] text-[var(--gifts-button-text-color-primary)] text-center py-1 pl-3 pr-4 rounded-full border-none font-[600] text-[13px]">
          <TokenIcon token={gift.price.token} bg={false} />
          {gift.price.amount} {gift.price.token}
        </button>
      </div>
    </div>
  );
};
