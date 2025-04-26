import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "./utils";

const card = tv({
  base: [
    // Base
    "rounded-surface p-[var(--gutter,var(--spacing-surface))] shadow-sm forced-colors:outline",
    // Layout
    "flex gap-[var(--gutter,var(--spacing-surface))]",
    // Border
    "ring-1 ring-brand-border",
  ],
  variants: {
    orientation: {
      vertical: "flex-col",
      horizontal: "flex-row",
    },
    color: {
      default: "bg-surface-background",
      none: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    color: "default",
  },
});

export { card as cardStyles };
export type CardStyles = VariantProps<typeof card>;

type CardProps = React.ComponentPropsWithoutRef<"section"> & CardStyles;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { orientation = "vertical", ...props }: CardProps,
  ref,
) {
  return (
    <section
      ref={ref}
      {...props}
      className={cn([props.className, card({ orientation })])}
    />
  );
});

export function CardHeader(props: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} />;
}

// TODO: Improve API Naming
type InsetDirection = "x" | "y" | "xy" | "none";
const insetStyles: Record<InsetDirection, string> = {
  x: "[margin-inline:calc(var(--gutter,theme(spacing.4))*-1)]",
  y: "[margin-block:calc(var(--gutter,theme(spacing.4))*-1)]",
  xy: "[margin-block:calc(var(--gutter,theme(spacing.4))*-1)] [margin-inline:calc(var(--gutter,theme(spacing.4))*-1)]",
  none: "",
};

type OffsetDirection = "x" | "y" | "xy" | "none";
const offsetStyles: Record<OffsetDirection, string> = {
  x: "px-[var(--gutter,theme(spacing.4))]",
  y: "py-[var(--gutter,theme(spacing.4))]",
  xy: "p-[var(--gutter,theme(spacing.4))]",
  none: "",
};

export function CardOverflow({
  inset = "x",
  offset = "x",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  inset?: InsetDirection;
  offset?: OffsetDirection;
}) {
  return (
    <div
      {...props}
      className={cn([
        "[unicode-bidi:isolate]",
        insetStyles[inset],
        offsetStyles[offset],
        props.className,
      ])}
    ></div>
  );
}
