import { useLayoutEffect, RefObject } from "react";
import { useLocation } from "react-router-dom";

export function useScrollRestoration(containerRef: RefObject<HTMLElement>) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop;
      sessionStorage.setItem(
        `scrollPosition:${pathname}`,
        scrollPosition.toString()
      );
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [pathname, containerRef]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const savedPosition = sessionStorage.getItem(`scrollPosition:${pathname}`);

    const timer = setTimeout(() => {
      if (savedPosition) {
        container.scrollTop = parseInt(savedPosition);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname, containerRef]);
}
