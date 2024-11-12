import { cn } from "@/helpers/utils";
import { type FC } from "react";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton: FC<SkeletonProps> = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded",
        className,
      )}
      {...props}
    />
  );
};
