import {
  Menu as AriaMenu,
  MenuItem as AriaMenuItem,
  type MenuItemProps as AriaMenuItemProps,
  type MenuProps as AriaMenuProps,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import type { ColorMap } from "./constants";
import { Description } from "./fieldset";
import {
  type PassThroughPopoverProps,
  Popover,
  splitPopoverProps,
} from "./popover";
import { cn } from "./utils";
import { textStyles } from "./text";

/**
 * Menu with forwardedRef.
 */
export function Menu<T extends object>(
  props: AriaMenuProps<T> & PassThroughPopoverProps
) {
  const [popoverProps, menuProps] = splitPopoverProps(props);
  const { className } = menuProps;

  return (
    <Popover
      bleed
      {...popoverProps}
      placement={popoverProps.placement ?? "bottom end"}
    >
      <AriaMenu
        {...menuProps}
        className={cn(className, [
          // Base styles
          "isolate max-h-64 w-max outline-none min-w-[var(--trigger-width)] scroll-py-1 rounded-radius-control py-1 select-none",
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          "outline outline-transparent focus:outline-none",
          // Handle scrolling when menu won't fit in viewport
          "overflow-y-auto overscroll-contain",
          // Define grid at the menu level if subgrid is supported
          "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
          // Shadows
          "shadow-lg ring-1 ring-neutral-950/10 dark:ring-white/10 dark:ring-inset",
          // Divider
          "*:data-[slot=divider]:col-span-full",
        ])}
      />
    </Popover>
  );
}

const menuItemStyles = tv({
  base: [
    // Base styles
    "group cursor-default px-3.5 py-2.5 focus:outline-hidden",
    // Typography styles
    textStyles({ label: "sm" }),
    "forced-colors:text-[CanvasText]",
    // Text Color
    "bg-[color:var(--menu-item-bg)] text-[color:var(--menu-item-text)]",
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
  ],
  variants: {
    color: {
      none: "",
      primary: [
        "[--menu-item-bg:var(--color-brand-primary-muted)] [--menu-item-text:var(--color-brand-primary-text)]",
      ],
      neutral: [
        "[--menu-item-text:var(--color-brand-neutral-text)]",
        // Active
        "focus:[--menu-item-bg:var(--color-brand-neutral-muted)] focus:[--menu-item-text:var(--color-brand-neutral-text)]",
      ],
      danger: [
        "[--menu-item-text:var(--color-brand-danger-text)]",
        // Active
        "focus:[--menu-item-bg:var(--color-brand-danger-muted)] focus:[--menu-item-text:var(--color-brand-danger-text)]",
      ],
      warning: [
        "[--menu-item-bg:var(--color-brand-warning-muted)] [--menu-item-text:var(--color-brand-warning-text)]",
      ],
      success: [
        "[--menu-item-bg:var(--color-brand-success-muted)] [--menu-item-text:var(--color-brand-success-text)]",
      ],
      info: [
        "[--menu-item-bg:var(--color-brand-info-muted)] [--menu-item-text:var(--color-brand-info-text)]",
      ],
    } satisfies ColorMap,
  },
});
type MenuItemVariants = VariantProps<typeof menuItemStyles>;

export function MenuItem<T extends object>({
  className,
  color = "neutral",
  ...props
}: Omit<AriaMenuItemProps<T>, "className"> &
  MenuItemVariants & { className?: string }) {
  return (
    <AriaMenuItem {...props} className={menuItemStyles({ color, className })} />
  );
}

export function MenuSection<T extends object>({
  className,
  ...props
}: AriaMenuSectionProps<T>) {
  const classes = cn(
    className,
    // Base styles
    "cursor-default focus:outline-hidden",
    // Text styles
    "text-left text-base/6 text-brand-neutral-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
    // Focus
    "focus:bg-brand-neutral-subtle focus:text-brand-neutral-text",
    // Disabled state
    "disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:*:data-[slot=icon]:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4",
    "*:data-[slot=icon]:text-neutral-500 focus:*:data-[slot=icon]:text-brand-primary dark:*:data-[slot=icon]:text-neutral-400 dark:focus:*:data-[slot=icon]:text-white",
    // Avatar
    "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5"
  );

  return <AriaMenuSection {...props} className={classes} />;
}

export function MenuLabel({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      data-slot="label"
      {...props}
      slot="label"
      className={cn(className, "col-start-2 row-start-1")}
    />
  );
}

export function MenuDescription(props: AriaTextProps) {
  return (
    <Description
      {...props}
      className={cn(["col-span-2 col-start-2 row-start-2"])}
    />
  );
}
