import clsx from "clsx";
import { forwardRef } from "react";
import {
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  OverlayArrow,
} from "react-aria-components";
import { cn } from "./utils";

export const Tooltip = forwardRef<HTMLDivElement, AriaTooltipProps>(
  function Tooltip(props, ref) {
    return (
      <AriaTooltip
        ref={ref}
        {...props}
        className={clsx([
          props.className,
          // Base
          "forced-colors:outline' bg-surface-background p-[var(--gutter,theme(spacing.2))] shadow-sm ring-zinc-950/10 sm:rounded-[calc(var(--surface-radius)/2)] dark:bg-zinc-900 dark:ring-white/10",
          // Layout
          "flex gap-[var(--gutter,theme(spacing.5))]",
          // Border
          "border border-zinc-950/10 dark:border-white/10",
        ])}
      >
        {(renderProps) => (
          <>
            <OverlayArrow className="group">
              <svg
                width={8}
                height={8}
                className={cn([
                  "text-surface-background block",
                  // Rotate
                  "group-data-[placement=bottom]:rotate-180 group-data-[placement=left]:translate-y-1/2",
                ])}
                viewBox="0 0 8 8"
              >
                <path fill="currentColor" d="M0 0 L4 4 L8 0" />
              </svg>
            </OverlayArrow>
            {typeof props.children === "function"
              ? props.children(renderProps)
              : props.children}
          </>
        )}
      </AriaTooltip>
    );
  }
);
