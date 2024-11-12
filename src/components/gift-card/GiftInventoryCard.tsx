import { FC } from "react";
import { publicUrl } from "@/helpers/publicUrl";
import { Lottie } from "../lottie/Lottie";
import { useTranslation } from "react-i18next";
import { PurchasedGiftResponse } from "@/api/api";

export const GiftInventoryCard: FC<{
  gift: PurchasedGiftResponse;
  onSelect: (gift: PurchasedGiftResponse) => void;
}> = ({ gift, onSelect }) => {
  const { t } = useTranslation();
  return (
    <div
      // key={gift.id}
      onClick={() => onSelect(gift)}
      className="animate-in-card bg-bg-secondary dark:bg-[#2C2C2E] rounded-xl py-3 px-2 flex flex-col items-center justify-between cursor-pointer active:scale-95 transition-all duration-150"
    >
      <span className="text-[12px] text-[#8E8E93] mb-1 truncate w-full">
        {gift.name}
      </span>

      <div className="animate-in-lottie w-[80px] h-[80px]">
        <Lottie
          src={publicUrl(`lotties/${gift.slug}.lottie`)}
          autoplay={true}
          style={{
            width: 80,
            height: 80,
          }}
        />
      </div>

      <div className="mt-2 bg-primary text-white rounded-full w-[calc(100%-16px)] py-[6px] font-[600] text-[13px] text-center">
        {t("common.send")}
      </div>
    </div>
  );
};
