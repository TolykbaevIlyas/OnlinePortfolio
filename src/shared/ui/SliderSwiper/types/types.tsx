import { CSSProperties } from "react";

export type TCarousel = {
  images?: {
    alt: string;
    src: string;
    styles?: CSSProperties;
  }[];
  className?: string;
};
