import { useAppStore } from "@/stores/appStore";
import { blendColors } from "@/utils/colors";
import { miniApp, setMiniAppHeaderColor } from "@telegram-apps/sdk-react";
import { motion } from "framer-motion";
import { type FC, useEffect } from "react";

export const BottomSheet: FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const { theme } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      const blended = blendColors(
        theme === "dark" ? "#1C1C1E" : "#ffffff",
        "#000000/30",
      ) as any;
      setMiniAppHeaderColor(blended);
    } else {
      setMiniAppHeaderColor(theme === "dark" ? "#1C1C1E" : "#ffffff");
    }
  }, [isOpen]);

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/30 z-[1000]"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: {
            duration: 0.21,
            ease: "linear",
          },
        }}
        exit={{
          opacity: 0,
          transition: {
            duration: 0.21,
            ease: "linear",
          },
        }}
        onClick={onClose}
      />
      <motion.div
        className="fixed bottom-[-32px] left-0 right-0 bg-bg-secondary dark:bg-[#1C1C1E] rounded-t-[12px] p-4 z-[1001]"
        initial={{ y: "100%" }}
        animate={{
          y: isOpen ? 0 : "100%",
        }}
        exit={{ y: "100%" }}
        drag="y"
        dragConstraints={{ top: 0 }}
        dragElastic={0.05}
        dragSnapToOrigin={true}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) {
            onClose();
          }
        }}
        transition={{
          type: "spring",
          duration: 0.4,
          bounce: 0.0,
        }}
        style={{
          willChange: "transform",
          transform: "translateZ(0)",
          paddingBottom: `calc(1rem + env(safe-area-inset-bottom) + 32px)`,
        }}
      >
        <motion.button
          onClick={onClose}
          className="absolute right-4 top-3 w-[30px] h-[30px] bg-[#e3e3e7] dark:bg-[#2C2C2E] rounded-full flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="text-[#9E9EA1]"
            width="10"
            height="10"
            viewBox="0 0 10 10"
          >
            <path
              d="M1 1L9 9M1 9L9 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </motion.button>
        {children}
      </motion.div>
    </>
  );
};
