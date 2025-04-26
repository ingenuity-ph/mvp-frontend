import type { Orientation } from "./constants";
import { cn } from "./utils";

export function DescriptionList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dl">) {
  return (
    <dl
      {...props}
      className={cn(
        className,
        "group text-base/6 sm:text-sm/6",
        // Layout, use a different layout when a there are items that are grouped
        "grid grid-cols-1 has-not-[[data-component=description-group]]:sm:grid-cols-[var(--cols,min(50%,theme(spacing.80))_auto)] has-data-[component=description-group]:sm:grid-cols-[repeat(var(--cols,2),minmax(0,1fr))]",
      )}
    />
  );
}

export function DescriptionGroup({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  orientation?: Orientation;
}) {
  return (
    <div
      {...props}
      data-orientation={orientation}
      data-component="description-group"
      className={cn([className, "group/dl"])}
    />
  );
}

export function DescriptionTerm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dt">) {
  return (
    <dt
      {...props}
      className={cn(
        className,
        "col-start-1 text-zinc-500 dark:text-zinc-400",
        // Border
        "border-t border-zinc-950/5 group-data-[component=description-group]/dl:border-0 first:border-none sm:border-zinc-950/5 dark:border-white/5 sm:dark:border-white/5",
        // Spacing
        "pt-3 group-data-[component=description-group]/dl:py-0 group-data-[component=description-group]/dl:pt-0 sm:py-3",
      )}
    />
  );
}

export function DescriptionDetails({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"dd">) {
  return (
    <dd
      {...props}
      className={cn(
        className,
        "text-zinc-950 dark:text-white",
        // Border
        "sm:border-zinc-950/5 group-not-data-[component=description-group]:sm:border-t dark:sm:border-white/5 sm:[&:nth-child(2)]:border-none",
        // Spacing
        "pt-1 pb-3 group-data-[component=description-group]/dl:py-0 group-data-[component=description-group]/dl:pt-0 sm:py-3",
      )}
    />
  );
}
