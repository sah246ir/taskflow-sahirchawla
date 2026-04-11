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
      xs: "text-xs leading-4",
      sm: "text-sm leading-5",
      md: "text-base leading-6",
      lg: "text-lg leading-6",
      xl: "text-xl leading-8",
      "2xl": "text-2xl leading-9",
    },
    color: {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      muted: "text-gray-600",
    },
  },
  defaultVariants: {
    variant: "regular",
    size: "md",
    color: "primary",
  },
});