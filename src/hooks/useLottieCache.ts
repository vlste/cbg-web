import { create } from "zustand";
import { useEffect, useState } from "react";

interface LottieCacheStore {
  cache: Record<string, ArrayBuffer>;
  addToCache: (key: string, buffer: ArrayBuffer) => void;
  getFromCache: (key: string) => ArrayBuffer | undefined;
}

export const useLottieCacheStore = create<LottieCacheStore>((set, get) => ({
  cache: {},
  addToCache: (key: string, buffer: ArrayBuffer) =>
    set((state) => ({ cache: { ...state.cache, [key]: buffer } })),
  getFromCache: (key: string) => get().cache[key],
}));

export const useLottieData = (src: string) => {
  const [data, setData] = useState<ArrayBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { getFromCache, addToCache } = useLottieCacheStore();

  useEffect(() => {
    let isMounted = true;

    const loadAnimation = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cachedData = getFromCache(src);
        if (cachedData) {
          if (isMounted) {
            setData(cachedData);
            setIsLoading(false);
          }
          return;
        }

        const response = await fetch(src);
        const buffer = await response.arrayBuffer();

        if (isMounted) {
          addToCache(src, buffer);
          setData(buffer);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err : new Error("Failed to load animation")
          );
          setIsLoading(false);
        }
      }
    };

    loadAnimation();

    return () => {
      isMounted = false;
    };
  }, [src, getFromCache, addToCache]);

  return { data, isLoading, error };
};
