"use client";

import { ReactElement } from "react";
import styles from "./Tabbar.module.css";

import { TabbarItem, TabbarItemProps } from "./TabbarItem/TabbarItem";
import clsx from "clsx";
import { AnimatePresence, HTMLMotionProps, motion } from "framer-motion";
import { useTabbar } from "@/hooks/useTabbar";

export interface TabbarProps extends HTMLMotionProps<"div"> {
  children: ReactElement<TabbarItemProps>[];
}

export const Tabbar = ({
  children,
  className,
  ...restProps
}: TabbarProps) => {
  const { isVisible } = useTabbar();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: isVisible ? 0 : 200 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={clsx(styles.wrapper, className)}
        {...restProps}
      >
        <div className={styles.tabbar}>{children}</div>
      </motion.div>
    </AnimatePresence>
  );
};

Tabbar.Item = TabbarItem;
