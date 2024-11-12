import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { App } from "@/components/App.tsx";
import { ErrorBoundary } from "@/components/error/ErrorBoundary.tsx";

import styles from "./Root.module.css";
import {
  initData,
  miniApp,
  on,
  setMiniAppBackgroundColor,
  setMiniAppHeaderColor,
  themeParams,
  useLaunchParams,
  useSignal,
} from "@telegram-apps/sdk-react";
import { cn } from "@/helpers/utils";
import { useEffect, useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { API } from "@/api/api";
import { BrowserRouter } from "react-router-dom";

const queryClient = new QueryClient();

function ErrorBoundaryError({ error }: { error: unknown }) {
  return (
    <div>
      <p>An unhandled error occurred:</p>
      <blockquote>
        <code>
          {error instanceof Error
            ? error.message
            : typeof error === "string"
            ? error
            : JSON.stringify(error)}
        </code>
      </blockquote>
    </div>
  );
}

const isColorDark = (color: string | undefined) => {
  if (!color) return false;
  const rgb = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!rgb) return false;
  const [, r, g, b] = rgb;
  return (
        parseInt(r, 16) * 299 + parseInt(g, 16) * 587 + parseInt(b, 16) * 114
      ) / 1000 < 120;
};

export function Root() {
  const themeState = useSignal(themeParams.state);
  const { theme, setTheme } = useAppStore();
  const lp = useLaunchParams();
  const initDataState = useSignal(initData.state);

  useEffect(() => {
    if (lp.initDataRaw) {
      API.setInitDataHeader(lp.initDataRaw);
    }
  }, [lp.initDataRaw]);

  useEffect(() => {
    const isDark = isColorDark(themeState.bgColor);
    setTheme(isDark ? "dark" : "light");
  }, [themeState]);

  useEffect(() => {
    setMiniAppHeaderColor(theme === "dark" ? "#1C1C1E" : "#FFFFFF");
    setMiniAppBackgroundColor(theme === "dark" ? "#1C1C1E" : "#FFFFFF");
  }, [theme]);

  const { setInitData } = useAppStore();

  useEffect(() => {
    if (initDataState) {
      setInitData(initDataState);
    }
  }, [initDataState]);

  return (
    <div className={cn(styles.wrapper, theme === "dark" && "dark")}>
      <ErrorBoundary fallback={ErrorBoundaryError}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </ErrorBoundary>
    </div>
  );
}
