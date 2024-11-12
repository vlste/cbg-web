import { cn } from "@/helpers/utils";
import type { FC } from "react";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Spinner: FC<SpinnerProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "relative inline-flex",
        className,
      )}
      {...props}
    >
      <div className="w-full h-full rounded-full border-2 border-[#8E8E93]/20" />
      <div className="absolute inset-0 rounded-full border-2 border-[#8E8E93] border-t-transparent animate-spin" />
    </div>
  );
};
