import React from "react";
import type { JSX } from "react";
import type { VariantProps } from "class-variance-authority";
import { TypefaceDefinition } from "./typeface";
import { cn } from "@/lib/utils";

type TypefaceProps = VariantProps<typeof TypefaceDefinition> & {
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements; // Allow different HTML tags like span, h1, p
  className?: string;
};

export const Typeface: React.FC<TypefaceProps> = ({
  variant,
  size,
  color,
  as: Tag = "p",
  children,
  className,
}) => {
  return (
    <Tag className={cn(TypefaceDefinition({ variant, size, color }), className)}>
      {children}
    </Tag>
  );
};