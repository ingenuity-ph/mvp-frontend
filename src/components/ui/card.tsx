import React from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "./utils";

const card = tv({
  base: [
    // Base
    "rounded-surface overflow-hidden shadow-sm forced-colors:outline",
    // Layout
    "flex gap-[var(--gutter,var(--spacing-surface))]",
    // Border
    "ring-1 ring-brand-neutral-border",
    // Variables
    "[--inset-padding-top:calc(var(--card-padding-top)-var(--card-border-width))]",
    "[--inset-padding-right:calc(var(--card-padding-right)-var(--card-border-width))]",
    "[--inset-padding-bottom:calc(var(--card-padding-bottom)-var(--card-border-width))]",
    "[--inset-padding-left:calc(var(--card-padding-left)-var(--card-border-width))]",
    "[--inset-border-width:var(--card-border-width)]",
    "[--inset-border-radius: var(--radius-surface)]",
  ],
  variants: {
    gutter: {
      none: "",
      default: [
        // Padding
        "pt-(--surface-padding-top) pr-(--surface-padding-right) pb-(--surface-padding-bottom) pl-(--surface-padding-left)",
      ],
    },
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
    gutter: "default",
  },
});

export { card as cardStyles };
export type CardStyles = VariantProps<typeof card>;

type CardProps = React.ComponentPropsWithoutRef<"section"> & CardStyles;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(
  { orientation = "vertical", gutter, color, ...props }: CardProps,
  ref
) {
  return (
    <section
      ref={ref}
      {...props}
      className={cn([props.className, card({ orientation, gutter, color })])}
    />
  );
});

const inset = tv({
  base: [
    "[--inset-border-radius-calc:calc(var(--inset-border-radius,0px)-var(--inset-border-width,0px))]",
    "[--inset-padding-top-calc:var(--inset-padding-top,0px)]",
    "[--inset-padding-right-calc:var(--inset-padding-right,0px)]",
    "[--inset-padding-bottom-calc:var(--inset-padding-bottom,0px)]",
    "[--inset-padding-left-calc:var(--inset-padding-left,0px)]",
    //
    "[--margin-top-override:calc(var(--margin-top)-var(--inset-padding-top-calc))]",
    "[--margin-right-override:calc(var(--margin-right)-var(--inset-padding-right-calc))]",
    "[--margin-bottom-override:calc(var(--margin-bottom)-var(--inset-padding-bottom-calc))]",
    "[--margin-left-override:calc(var(--margin-left)-var(--inset-padding-left-calc))]",
  ],
  variants: {
    side: {
      top: [""],
      right: [""],
      bottom: [""],
      left: [""],
    },
  },
  defaultVariants: {
    side: "top",
  },
});

export function Inset(props: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={cn([inset(), "surface-inset"])} />;
}
