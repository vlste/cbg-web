import { useLottieData } from "@/hooks/useLottieCache";
import {
  DotLottieWorker,
  DotLottieWorkerReact,
} from "@lottiefiles/dotlottie-react";
import { FC, useEffect, useState } from "react";

export const Lottie: FC<{
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  style?: React.CSSProperties;
  autoResize?: boolean;
  onRef?: (ref: DotLottieWorker) => void;
}> = ({ src, autoplay = true, loop = true, style, autoResize, onRef }) => {
  const { data: animationData } = useLottieData(src);
  const [ref, setRef] = useState<DotLottieWorker | null>(null);

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
          setRef(newRef);
          onRef?.(newRef);
        }
      }}
    />
  );
};
