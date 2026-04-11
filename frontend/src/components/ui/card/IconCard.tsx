import React from "react";
import { cn } from "@/lib/utils";

type IconCardProps = {
  children: React.ReactNode;
  className?: string;
};

const IconCard: React.FC<IconCardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "p-1.5 aspect-square border border-border rounded-lg shadow-sm bg-card flex items-center justify-center",
        className
      )}
    >
      {children}
    </div>
  );
};

export default IconCard;
