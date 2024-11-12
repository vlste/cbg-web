import { FC } from "react";
import { cn, oneLetterAvatar } from "@/helpers/utils";
import { Img } from "../img/Img";

export interface AvatarProps {
  src: string;
  placeholder?: string;
  size?: number;
  badge?: {
    text: string;
    color: string;
  };
  style?: React.CSSProperties;
}

export const Avatar: FC<AvatarProps> = ({
  src,
  placeholder,
  badge,
  size = 100,
  style,
}) => {
  const styling = {
    width: `${size}px`,
    height: `${size}px`,
    ...style,
  };

  return (
    <div className="relative" style={styling}>
      <Img
        src={src}
        alt="profile"
        className="w-full h-full rounded-full bg-bg-secondary dark:bg-[#2C2C2E]"
      />
      {badge && badge.text !== "" && (
        <div
          className={cn(
            "absolute px-[10px] pb-[2px] rounded-full border-[3px] border-white dark:border-[#1C1C1E]",
            "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2",
            badge.color,
          )}
        >
          <span className="text-[14px] font-[500] text-white">
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
};
