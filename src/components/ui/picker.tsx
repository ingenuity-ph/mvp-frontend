import { tv } from "tailwind-variants";
import { textStyles } from "./text";
import type { ColorMap } from "./constants";
import {
  LabelContext,
  ListBoxItem,
  Provider,
  type ListBoxItemProps,
} from "react-aria-components";
import { cn } from "./utils";

export const pickerStyles = tv({
  slots: {
    list: [
      // Base styles
      "isolate w-max min-w-[var(--trigger-width)] scroll-py-1 rounded-control py-1 select-none",
      // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
      "outline outline-transparent focus:outline-none",
      // Handle scrolling when menu won't fit in viewport
      "overflow-y-auto overscroll-contain",
      // Define grid at the menu level if subgrid is supported
      "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
      // Popover background
      "bg-white/95 backdrop-blur-xl dark:bg-neutral-800/75",
      // Shadows
      "shadow-lg ring-1 ring-neutral-950/10 dark:ring-white/10 dark:ring-inset",
      // Divider
      "*:data-[slot=divider]:col-span-full",
    ],
    listItem: [],
  },
});

export const pickerOptionStyles = tv({
  base: [
    // Base styles
    "group/option cursor-default px-3.5 py-2.5 focus:outline-hidden",
    // Typography styles
    textStyles({ label: "sm", color: "none" }),
    "forced-colors:text-[CanvasText]",
    // Text Color
    "bg-[color:var(--picker-item-bg)] text-[color:var(--picker-item-text)]",
    // Disabled state
    "disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:*:data-[slot=icon]:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4",
    "*:data-[slot=icon]:text-zinc-500 data-focus:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400 dark:data-focus:*:data-[slot=icon]:text-white",
    // Avatar
    "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5",
    // Label
    "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1",
    // Description
    "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2 [&>[data-slot=description]]:col-span-2",
  ],
  variants: {
    color: {
      none: "",
      primary: [
        "[--picker-item-bg:var(--color-brand-primary-muted)] [--picker-item-text:var(--color-brand-primary-text)]",
      ],
      neutral: [
        "[--picker-item-text:var(--color-brand-neutral-text)]",
        // Active
        "focus:[--picker-item-bg:var(--color-brand-neutral-muted)] focus:[--picker-item-text:var(--color-brand-neutral-text)]",
      ],
      danger: [
        "[--picker-item-text:var(--color-brand-danger-text)]",
        // Active
        "focus:[--picker-item-bg:var(--color-brand-danger-muted)] focus:[--picker-item-text:var(--color-brand-danger-text)]",
      ],
      warning: [
        "[--picker-item-bg:var(--color-brand-warning-muted)] [--picker-item-text:var(--color-brand-warning-text)]",
      ],
      success: [
        "[--picker-item-bg:var(--color-brand-success-muted)] [--picker-item-text:var(--color-brand-success-text)]",
      ],
      info: [
        "[--picker-item-bg:var(--color-brand-info-muted)] [--picker-item-text:var(--color-brand-info-text)]",
      ],
    } satisfies ColorMap,
  },
});

export function Option({ className, ...props }: ListBoxItemProps) {
  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <ListBoxItem
        {...props}
        className={cn(pickerOptionStyles({ color: "neutral" }), className)}
      />
    </Provider>
  );
}
