"use client";

import Image from "next/image";
import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { NoImage } from "./NoImage";

/**
 * Fills a `relative` parent with the cover image, or the retro NoImage
 * placeholder when there's no src OR the image fails to load. The image
 * stays transparent until it loads (placeholder shows underneath), so the
 * browser's broken-image glyph never flashes.
 */
export const ArticleImage: React.FC<{
  src?: string;
  alt: string;
  sizes?: string;
  imgClassName?: string;
  iconClassName?: string;
}> = ({ src, alt, sizes, imgClassName, iconClassName }) => {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || failed) {
    return <NoImage className="absolute inset-0 border-0" iconClassName={iconClassName} />;
  }

  return (
    <>
      {!loaded && <NoImage className="absolute inset-0 border-0" iconClassName={iconClassName} />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "object-cover transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName,
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
};

export default ArticleImage;
