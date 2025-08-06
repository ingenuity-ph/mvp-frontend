import { toast, Toaster as ToasterPrimitive, type ToasterProps } from "sonner";
import {
  CheckCircle,
  Info,
  Warning,
  WarningCircle,
  X,
} from "@phosphor-icons/react";
import { buttonStyles } from "./button";
import { cardStyles } from "./card";
import { ProgressCircle } from "./progress";
import { textStyles } from "./text";
import { cn } from "./utils";

export { toast as toaster };

export function Toast({ ...props }: ToasterProps) {
  return (
    <ToasterPrimitive
      className="group"
      icons={{
        info: <Info />,
        success: <CheckCircle />,
        warning: <Warning />,
        error: <WarningCircle />,
        loading: <ProgressCircle />,
        close: <X />,
      }}
      toastOptions={{
        unstyled: true,
        className: "",
        closeButton: true,
        classNames: {
          toast: cn(
            // Surface
            cardStyles({ color: "default", orientation: "horizontal" }),
            // Base
            "min-w-[22rem] items-center",
            // Icon
            "[&>[data-icon]]:-mx-0.5 [&>[data-icon]]:my-0.5 [&>[data-icon]]:size-5 [&>[data-icon]]:shrink-0 [&>[data-icon]]:text-[--btn-icon] [&>[data-icon]]:sm:my-1 [&>[data-icon]]:sm:size-4 forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText]"
          ),
          content: textStyles({ paragraph: "sm", color: "neutral" }),
          error:
            "bg-danger ring-danger-fg/10 text-white ring-inset [&>[data-close-button=true]>svg]:text-white [&>[data-close-button=true]:hover]:bg-white/20",
          info: "bg-info ring-info-fg/10 text-info-fg ring-inset [&>[data-close-button=true]>svg]:text-info-fg [&>[data-close-button=true]:hover]:bg-white/20",
          warning:
            "bg-warning text-warning-fg ring-warning-fg/10 ring-inset [&>[data-close-button=true]>svg]:text-amber-950 [&>[data-close-button=true]:hover]:bg-white/20",
          success:
            "bg-primary ring-primary/50 text-primary-fg ring-inset [&>[data-close-button=true]>svg]:text-primary-fg [&>[data-close-button=true]:hover]:bg-primary-fg/20",
          cancelButton: cn([buttonStyles()]),
          actionButton: cn([buttonStyles()]),
        },
      }}
      {...props}
    />
  );
}
