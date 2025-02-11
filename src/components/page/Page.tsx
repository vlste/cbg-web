import { useNavigate } from "react-router-dom";
import {
  backButton,
  hapticFeedback,
  mainButton,
  mainButtonState,
  useSignal,
} from "@telegram-apps/sdk-react";
import {
  AllHTMLAttributes,
  forwardRef,
  PropsWithChildren,
  useEffect,
} from "react";
import styles from "./Page.module.css";
import { cn } from "@/helpers/utils";

export interface PageProps extends AllHTMLAttributes<HTMLDivElement> {
  back?: boolean;
  tabbar?: boolean;
}

export const Page = forwardRef<HTMLDivElement, PropsWithChildren<PageProps>>(
  ({ children, back = true, tabbar = true, ...props }, ref) => {
    const navigate = useNavigate();

    const mainButtonIsVisible = useSignal(mainButton.isVisible);

    useEffect(() => {
      if (back) {
        backButton.show();
        return backButton.onClick(() => {
          hapticFeedback.selectionChanged();
          navigate(-1);
        });
      }
      backButton.hide();
    }, [back]);

    return (
      <div
        ref={ref}
        className={cn(
          styles.page,
          !tabbar && styles["page--no-tabbar"],
          mainButtonIsVisible
            ? "pb-0"
            : `pb-[calc(env(safe-area-inset-bottom)+58px)]`,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Page.displayName = "Page";
