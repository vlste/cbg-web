import { publicUrl } from "@/helpers/publicUrl";
import { cn } from "@/helpers/utils";
import { FC, useEffect, useState } from "react";

export interface ImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  className?: string;
  placeholder?: string;
}

export const Img: FC<ImgProps> = ({
  src,
  placeholder,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState(src);

  // useEffect(() => {
  //   const cachedImage = localStorage.getItem(`imgCache-${src}`);

  //   if (cachedImage) {
  //     setImageSrc(cachedImage);
  //   } else {
  //     fetch(src ?? "")
  //       .then((response) => response.blob())
  //       .then((blob) => {
  //         const reader = new FileReader();
  //         reader.onloadend = () => {
  //           const base64data = reader.result;
  //           localStorage.setItem(`imgCache-${src}`, base64data as string);
  //           setImageSrc(base64data as string);
  //         };
  //         reader.readAsDataURL(blob);
  //       })
  //       .catch((error) => {
  //         console.error("Error caching image:", error);
  //         setImageSrc(src);
  //       });
  //   }
  // }, [src]);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-bg-secondary dark:bg-[#3A3A3C] rounded-full" />
      )}

      <img
        className={cn(
          isLoading ? "opacity-0" : "opacity-100",
          className,
        )}
        src={src}
        onLoad={() => setIsLoading(false)}
        {...props}
      />
    </div>
  );
};
