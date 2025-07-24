import type React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import type { Inset, VariantConfigMap } from "./constants";
import { cn } from "./utils";

const surfaceStyles = tv({
  base: [
    // Base
    "rounded-[var(--surface-radius,var(--radius-surface))] p-[var(--gutter,var(--spacing-surface))] forced-colors:outline",
    // Layout
    "flex gap-[var(--spacing-surface-gap,var(--spacing-surface))]",
    //
    "[&>[data-slot=header]+[data-slot=content]]:mt-4",
    "[&>[data-slot=content]+[data-slot=footer]]:mt-8",
  ],
  variants: {
    border: {
      none: "",
      default: [
        // Border
        "ring-1 ring-[var(--surface-border-color,var(--color-surface-border))]",
      ],
    },
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    color: {
      default: "bg-surface-background dark:bg-neutral-800/75",
      none: "",
    },
    inset: {
      top: "mt-[calc(var(--gutter,theme(spacing.4))*-1)]",
      right: "[margin-inline-end:calc(var(--gutter,theme(spacing.4))*-1)]",
      bottom: "mb-[calc(var(--gutter,theme(spacing.4))*-1)]",
      left: "[margin-inline-start:calc(var(--gutter,theme(spacing.4))*-1)]",
      all: "m-[calc(var(--gutter,theme(spacing.4))*-1)]",
      none: "",
    } as VariantConfigMap<Inset>,
    offset: {
      top: "pt-[var(--gutter,var(--spacing-surface))]",
      right: "pr-[var(--gutter,var(--spacing-surface))]",
      bottom: "pb-[var(--gutter,var(--spacing-surface))]",
      left: "pl-[var(--gutter,var(--spacing-surface))]",
      all: "p-[var(--gutter,var(--spacing-surface))]",
      none: "",
    } as VariantConfigMap<Inset>,
  },
  defaultVariants: {
    orientation: "vertical",
    color: "default",
    inset: "none",
    offset: "none",
    border: "default",
  },
});

export { surfaceStyles };
export type SurfaceVariants = VariantProps<typeof surfaceStyles>;

export function SurfaceOverflow({
  inset = "all",
  offset = "all",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  inset?: Array<Inset> | Inset;
  offset?: Array<Inset> | Inset;
}) {
  const matchingInset = Array.isArray(inset)
    ? inset.map((item) => surfaceStyles.variants.inset[item]).join(" ")
    : surfaceStyles.variants.inset[inset];
  const matchingOffset = Array.isArray(offset)
    ? offset.map((item) => surfaceStyles.variants.offset[item]).join(" ")
    : surfaceStyles.variants.offset[offset];

  return (
    <div
      {...props}
      className={cn([
        "[unicode-bidi:isolate]",
        matchingInset,
        matchingOffset,
        props.className,
      ])}
    />
  );
}

export function SurfaceActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto"
      )}
    />
  );
}
