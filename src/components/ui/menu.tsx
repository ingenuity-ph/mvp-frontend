import clsx from "clsx";
import {
  Menu as AriaMenu,
  type MenuProps as AriaMenuProps,
  MenuItem as AriaMenuItem,
  MenuSection as AriaMenuSection,
  type MenuSectionProps as AriaMenuSectionProps,
  type MenuItemProps as AriaMenuItemProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
} from "react-aria-components";

// Menu with forwardedRef
export function Menu<T extends object>(props: AriaMenuProps<T>) {
  return (
    <AriaMenu
      {...props}
      className={clsx(props.className, "outline-none", [
        // Define grid at the menu level if subgrid is supported
        "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_1.5rem_0.5rem_auto]",
      ])}
    />
  );
}

export function MenuItem<T extends object>({
  className,
  ...props
}: AriaMenuItemProps<T>) {
  const classes = clsx(
    className,
    // Base styles
    "group cursor-default px-3.5 py-2.5 outline-none sm:px-3 sm:py-1.5",
    // Surface styles
    "mx-[calc(var(--gutter,theme(spacing.1))*-1)]",
    // Text styles
    "text-left text-base/6 text-zinc-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]",
    // Focus
    `focus:bg-(--color-brand-primary)/5 focus:text-(--color-brand-primary)`,
    // Disabled state
    "disabled:opacity-50",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:focus:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:sm:size-4",
    "[&>[data-slot=icon]]:text-brand-secondary-500 [&>[data-slot=icon]]:dark:text-brand-secondary-400 [&>[data-slot=icon]]:focus:dark:text-white",
    // Avatar
    "[&>[data-slot=avatar]]:-ml-1 [&>[data-slot=avatar]]:mr-2.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:mr-2 sm:[&>[data-slot=avatar]]:size-5"
  );

  return <AriaMenuItem {...props} className={classes} />;
}

export function MenuSection<T extends object>({
  className,
  ...props
}: AriaMenuSectionProps<T>) {
  const classes = clsx(
    className,
    // Base styles
    "px-3.5 py-2.5 focus:outline-none sm:px-3 sm:py-1.5",
    // Surface styles
    "mx-[calc(var(--gutter,theme(spacing.1))*-1)]",
    // Text styles
    "text-left text-base/6 text-zinc-950 dark:text-white sm:text-sm/6 forced-colors:text-[CanvasText]",
    // Forced colors mode
    "forced-color-adjust-none forced-colors:focus:bg-[Highlight] forced-colors:focus:text-[HighlightText] forced-colors:[&>[data-slot=icon]]:focus:text-[HighlightText]",
    // Use subgrid when available but fallback to an explicit grid layout if not
    "col-span-full grid grid-cols-[auto_1fr_1.5rem_0.5rem_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
    // Icons
    "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:-ml-0.5 [&>[data-slot=icon]]:mr-2.5 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:mr-2 [&>[data-slot=icon]]:sm:size-4",
    "[&>[data-slot=icon]]:text-brand-secondary-500 [&>[data-slot=icon]]:dark:text-brand-secondary-400 [&>[data-slot=icon]]:focus:dark:text-white"
  );

  return <AriaMenuSection {...props} className={classes} />;
}

export function MenuLabel(props: AriaTextProps) {
  return (
    <AriaText
      data-slot="label"
      {...props}
      slot="label"
      className={clsx("col-start-2 row-start-1")}
    />
  );
}

export function MenuDescription(props: AriaTextProps) {
  return (
    <AriaText
      data-slot="description"
      {...props}
      slot="description"
      className={clsx(
        "col-span-2 col-start-2 row-start-2 text-sm/5 text-zinc-500 group-focus:text-white sm:text-xs/5 dark:text-zinc-400 forced-colors:group-focus:text-[HighlightText]"
      )}
    />
  );
}
