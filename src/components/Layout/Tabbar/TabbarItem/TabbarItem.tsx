"use client";

import {
  ButtonHTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./TabbarItem.module.css";
import { hasReactNode } from "@/helpers/react-node";
import clsx from "clsx";
import { publicUrl } from "@/helpers/publicUrl";
import {
  DotLottie,
  DotLottieReact,
  DotLottieWorker,
} from "@lottiefiles/dotlottie-react";

export interface TabbarItemProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  lottieIconFileName?: string;
  text?: string;
  children?: ReactNode;
  onDoubleTap?: () => void;
}

export const TabbarItem = ({
  selected,
  lottieIconFileName,
  text,
  children,
  className,
  onClick,
  onDoubleTap,
  ...restProps
}: TabbarItemProps) => {
  const lastTap = useRef<number>(0);
  const [lottieRef, setLottieRef] = useState<DotLottie>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const now = Date.now();
    const isDoubleTap = now - lastTap.current < 300;

    if (isDoubleTap && onDoubleTap) {
      onDoubleTap();
    } else if (onClick) {
      lottieRef?.play();
      onClick(event);
    }

    lastTap.current = now;
  };

  return (
    <button
      className={clsx(
        styles.wrapper,
        selected && styles["wrapper--selected"],
        className,
      )}
      onClick={handleClick}
      {...restProps}
    >
      <div className="relative w-[26px] h-[26px]">
        <div
          className="absolute inset-0"
          style={{
            opacity: selected ? 0 : 1,
            color: selected ? "#007aff" : "currentColor",
          }}
        >
          {children}
        </div>
        {lottieIconFileName && (
          <DotLottieReact
            src={publicUrl(`lotties/${lottieIconFileName}`)}
            autoplay={false}
            loop={false}
            style={{
              width: "100%",
              height: "100%",
              opacity: selected ? 1 : 0,
              position: "absolute",
              inset: 0,
            }}
            renderConfig={{
              freezeOnOffscreen: false,
              autoResize: false,
            }}
            dotLottieRefCallback={(ref) => {
              if (ref) {
                setLottieRef(ref);
              }
            }}
          />
        )}
      </div>
      {hasReactNode(text) && <span className={styles.text}>{text}</span>}
    </button>
  );
};
