import { FC } from "react";
import { publicUrl } from "@/helpers/publicUrl";
import { motion } from "framer-motion";
import { Lottie } from "../lottie/Lottie";
import { formatNumber } from "@/helpers/formatNumber";
import { useTranslation } from "react-i18next";
import { BASE_URL, PurchasedGiftResponse } from "@/api/api";
import { avatarUrl, oneLetterAvatar } from "@/helpers/utils";
import { Img } from "../img/Img";

export const GiftPlainCard: FC<{
  gift: PurchasedGiftResponse;
  onSelect: (gift: PurchasedGiftResponse) => void;
}> = ({ gift, onSelect }) => {
  const { t } = useTranslation();
  return (
    <div
      key={gift.id}
      onClick={() => onSelect(gift)}
      className="animate-in-card bg-bg-secondary dark:bg-[#2C2C2E] rounded-xl py-2 flex flex-col items-center justify-between cursor-pointer active:scale-95 transition-all duration-150"
    >
      <div className="flex flex-row items-center justify-between w-full px-2 mb-2">
        <Img
          src={avatarUrl(gift.buyer?.telegramId?.toString() || "")}
          className="w-[16px] h-[16px] rounded-full"
        />
        <div className="text-[12px] text-[#8E8E93] truncate flex-1 text-right mr-1">
          {formatNumber(gift.boughtCount)} {t("common.of")}{" "}
          {formatNumber(gift.totalCount)}
        </div>
      </div>

      <div className="animate-in-lottie w-[80px] h-[80px]">
        <Lottie
          src={publicUrl(`lotties/${gift.slug}.lottie`)}
          autoplay={true}
          style={{
            width: 80,
            height: 80,
            marginBottom: 20,
          }}
        />
      </div>

      <div className="mb-1 text-center text-[14px] text-black dark:text-white font-[500] truncate w-full">
        {gift.name}
      </div>
    </div>
  );
};
