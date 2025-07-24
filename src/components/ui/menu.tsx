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
import { Popover, type PopoverProps } from "./popover";
import { cn } from "./utils";

/**
 * Menu with forwardedRef.
 */
export function Menu<T extends object>({
  className,
  placement = "bottom end",
  ...props
}: AriaMenuProps<T> & Pick<PopoverProps, "placement">) {
  return (
    <Popover bleed placement={placement}>
      <AriaMenu
        {...props}
        className={cn(className, "outline-none", [
          // Base
          "min-w-(--trigger-width) w-max isolate py-1",
          // Define grid at the menu level if subgrid is supported
          "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
        ])}
      />
    </Popover>
  );
}

export function MenuItem<T extends object>({
  className,
  ...props
}: AriaMenuItemProps<T>) {
  const classes = cn(
    className,
    // Base styles
    "group cursor-default  px-3.5 py-2.5 focus:outline-hidden sm:px-3 sm:py-1.5",
    // Text styles
    "text-left text-base/6 text-brand-neutral-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
    // Focus
    "focus:bg-brand-primary-50 focus:text-brand-primary",
    // Disabled state
    "disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:focus:*:data-[slot=icon]:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "*:data-[slot=icon]:col-start-1 *:data-[slot=icon]:row-start-1 *:data-[slot=icon]:mr-2.5 *:data-[slot=icon]:-ml-0.5 *:data-[slot=icon]:size-5 sm:*:data-[slot=icon]:mr-2 sm:*:data-[slot=icon]:size-4",
    // Avatar
    "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5"
  );

  return <AriaMenuItem {...props} className={classes} />;
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
    "focus:bg-brand-primary-50 focus:text-brand-primary",
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
    <AriaText
      data-slot="description"
      {...props}
      slot="description"
      className={cn(
        "col-span-2 col-start-2 row-start-2 text-sm/5 text-neutral-500 group-focus:text-white sm:text-xs/5 dark:text-neutral-400 forced-colors:group-focus:text-[HighlightText]"
      )}
    />
  );
}
