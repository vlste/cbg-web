import { cn } from "@/helpers/utils";
import { motion } from "framer-motion";
import { type FC } from "react";

interface Segment {
  value: string;
  label?: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps {
  segments: Segment[];
  value: string;
  onChange: (value: string) => void;
  size?: "medium";
}

const SIZES = {
  medium: {
    track: "h-[32px]",
  },
} as const;

export const SegmentedControl: FC<SegmentedControlProps> = ({
  segments,
  value,
  onChange,
  size = "medium",
}) => {
  const activeIndex = segments.findIndex((segment) => segment.value === value);
  const xOffset = activeIndex * 38;

  return (
    <motion.div
      className={cn(
        "relative bg-bg-secondary dark:bg-black rounded-full p-[2px] flex flex-row items-center",
        SIZES[size].track,
      )}
      animate={{
        transition: { duration: 0.2 },
      }}
      onClick={() => {
        onChange(segments[activeIndex === 0 ? 1 : 0].value);
      }}
      whileTap={{
        scale: 0.95,
      }}
    >
      {segments.map((segment, index) => (
        <div
          key={segment.value}
          className="h-[28px] z-10 cursor-pointer px-2 flex items-center justify-center w-[38px]"
          // onClick={() => onChange(segment.value)}
        >
          <motion.div
            className={cn(
              "transition-all duration-200 whitespace-nowrap",
              "text-[14px] font-[590]",
              activeIndex === index ? "text-black" : "text-label-secondary",
            )}
          >
            {segment.icon}
            {segment.label}
          </motion.div>
        </div>
      ))}
      <motion.div
        className="absolute h-[28px] bg-white rounded-full w-[38px]"
        initial={false}
        animate={{ x: xOffset }}
        transition={{ duration: 0.2, type: "spring" }}
      />
    </motion.div>
  );
};
