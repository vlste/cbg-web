import { useLottieData } from "@/hooks/useLottieCache";
import {
  DotLottieWorker,
  DotLottieWorkerReact,
} from "@lottiefiles/dotlottie-react";
import { FC, useEffect, useRef, useState } from "react";

export const Lottie: FC<{
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  style?: React.CSSProperties;
  autoResize?: boolean;
  onRef?: (ref: DotLottieWorker) => void;
  onReady?: () => void;
}> = (
  { src, autoplay = true, loop = true, style, autoResize, onRef, onReady },
) => {
  const { data: animationData } = useLottieData(src);
  const [ref, setRef] = useState<DotLottieWorker | null>(null);
  const realRef = useRef<DotLottieWorker | null>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    return () => {
      if (ref) {
        const cleanup = async () => {
          await ref.destroy();
          (ref as any)._canvas = null;
        };
        cleanup();
      }
    };
  }, [ref]);

  useEffect(() => {
    const handleReady = () => {
      if (!rendered) {
        console.log("ready");
        setRendered(true);
        onReady?.();
      }
    };
    if (realRef.current) {
      realRef.current.addEventListener("render", handleReady);
      return () => {
        realRef.current?.removeEventListener("render", handleReady);
      };
    }
  }, [realRef.current, rendered]);

  if (!animationData) {
    return null;
  }

  return (
    <DotLottieWorkerReact
      // workerId={`lottie-${Math.random() % 3}`}
      data={animationData}
      autoplay={autoplay}
      loop={loop}
      style={style}
      renderConfig={{
        autoResize,
      }}
      dotLottieRefCallback={(newRef) => {
        if (newRef) {
          realRef.current = newRef;
          setRef(newRef);
          onRef?.(newRef);
        }
      }}
    />
  );
};
