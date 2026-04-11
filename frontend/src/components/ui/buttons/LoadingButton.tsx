import { Button, type ButtonProps } from "@/components/shadcn/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

interface LoadingButtonProps extends ButtonProps {
    isLoading?: boolean;
    loaderClassName?: string;
  }
  
  export const LoadingButton = React.forwardRef<
    HTMLButtonElement,
    LoadingButtonProps
  >(({ children, isLoading, loaderClassName, disabled, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        disabled={isLoading || disabled}
        {...props}
      >
        {isLoading ? (
          <Loader2
            className={cn(
              "animate-spin mr-2 h-4 w-4 text-current",
              loaderClassName
            )}
          />
        )
          :
          children
        }
      </Button>
    );
  });
  LoadingButton.displayName = "LoadingButton";