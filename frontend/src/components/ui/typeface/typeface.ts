import { cva } from "class-variance-authority";

export const TypefaceDefinition = cva("font-sans", {
  variants: {
    variant: {
      regular: "font-normal",
      medium: "font-medium",
      bold: "font-bold",
      italic: "italic",
    },
    size: {
      xs: "text-xs",
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
    },
    color: {
      primary: "text-black",
      secondary: "text-neutral-800",
      muted: "text-neutral-600",
      subtle: "text-neutral-500",
      faint: "text-neutral-400",
    },
  },
  defaultVariants: {
    variant: "regular",
    size: "md",
    color: "primary",
  },
});