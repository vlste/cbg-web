import { type FC } from "react";
import { Lottie } from "../lottie/Lottie";
import { publicUrl } from "@/helpers/publicUrl";

export interface EmptyStateProps {
  description: string;
  buttonTitle?: string;
  onButtonClick?: () => void;
}

export const EmptyState: FC<EmptyStateProps> = ({
  description,
  buttonTitle,
  onButtonClick,
}) => {
  return (
    <div className="flex flex-col items-center justify-center bg-bg-secondary dark:bg-[#2C2C2E] rounded-[12px] px-12 py-8 w-full animate-fade-in">
      <div className="w-[100px] h-[100px]">
        <Lottie
          src={publicUrl("/lotties/baloons.lottie")}
          loop={false}
          style={{ width: 100, height: 100 }}
        />
      </div>
      <p className="text-center text-dark dark:text-white text-[17px] font-[400] mt-4">
        {description}
      </p>
      {buttonTitle && (
        <button
          className="text-primary text-[17px] font-[590] mt-4 active:scale-95 transition-all"
          onClick={onButtonClick}
        >
          {buttonTitle}
        </button>
      )}
    </div>
  );
};
