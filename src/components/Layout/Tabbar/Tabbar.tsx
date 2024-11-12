"use client";

import { ReactElement, useEffect } from "react";
import styles from "./Tabbar.module.css";

import { TabbarItem, TabbarItemProps } from "./TabbarItem/TabbarItem";
import clsx from "clsx";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useTabbar } from "@/hooks/useTabbar";
import { useSignal } from "@telegram-apps/sdk-react";
import { mainButton } from "@telegram-apps/sdk-react";
import { cn } from "@/helpers/utils";

export interface TabbarProps extends HTMLMotionProps<"div"> {
  children: ReactElement<TabbarItemProps>[];
}

export const Tabbar = ({
  children,
  className,
  ...restProps
}: TabbarProps) => {
  const { isVisible } = useTabbar();
  const mainButtonIsVisible = useSignal(mainButton.isVisible);

  useEffect(() => {
    console.log(mainButtonIsVisible);
  }, [mainButtonIsVisible]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 200 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          styles.wrapper,
          className,
          mainButtonIsVisible
            ? "pb-0"
            : `pb-[calc(env(safe-area-inset-bottom)+58px)]`,
          mainButtonIsVisible
            ? "h-[58px]"
            : `h-[calc(58px+env(safe-area-inset-bottom))]`,
        )}
        {...restProps}
      >
        <div className={styles.tabbar}>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
};

Tabbar.Item = TabbarItem;
