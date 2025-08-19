import type React from "react";
import { LabelContext, Provider } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import type { ThemeColors } from "./constants";
import { surfaceStyles, type SurfaceVariants } from "./surface";
import { baseStyleConfig, cn } from "./utils";

type OptionalThemeColors = ThemeColors | "none";

const bannerStyles = tv({
  extend: baseStyleConfig,
  base: [
    // Define grid at the root level if subgrid is supported
    "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_auto]",
    // Icons
    "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:size-5",
    "[&>[data-slot=icon]]:text-[color:var(--banner-color-text)]",
    // Emphasis
    "bg-[color:var(--banner-color-background)] text-[color:var(--banner-color-text)]",
    // Footer
    "[&>[data-slot=footer]]:col-start-2 [&>[data-slot=footer]]:row-start-2",
  ],
  variants: {
    color: {
      none: [],
      primary: [],
      neutral: [],
      warning: [],
      success: [],
      danger: [],
      info: [],
    } satisfies Record<OptionalThemeColors, Array<string>>,
    emphasis: {
      muted: [],
      subtle: [],
      bold: [],
    },
  },
  compoundVariants: [
    {
      emphasis: "muted",
      color: "primary",
      className: [
        "[--banner-color-background:var(--color-brand-primary-muted)] [--banner-color-text:var(--color-brand-primary-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "primary",
      className: [
        "[--banner-color-background:var(--color-brand-primary-subtle)] [--banner-color-text:var(--color-brand-warning-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "primary",
      className: [
        "[--banner-color-background:var(--color-brand-primary-bold)] [--banner-color-text:var(--color-brand-primary-inverse)]",
      ],
    },
    {
      emphasis: "muted",
      color: "warning",
      className: [
        "[--banner-color-background:var(--color-brand-warning-muted)] [--banner-color-text:var(--color-brand-warning-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "warning",
      className: [
        "[--banner-color-background:var(--color-brand-warning-subtle)] [--banner-color-text:var(--color-brand-warning-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "warning",
      className: [
        "[--banner-color-background:var(--color-brand-warning-bold)] [--banner-color-text:var(--color-brand-warning-inverse)]",
      ],
    },
    {
      emphasis: "muted",
      color: "danger",
      className: [
        "[--banner-color-background:var(--color-brand-danger-muted)] [--banner-color-text:var(--color-brand-danger-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "danger",
      className: [
        "[--banner-color-background:var(--color-brand-danger-subtle)] [--banner-color-text:var(--color-brand-danger-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "danger",
      className: [
        "[--banner-color-background:var(--color-brand-danger-bold)] [--banner-color-text:var(--color-brand-danger-inverse)]",
      ],
    },
    // Success
    {
      emphasis: "muted",
      color: "success",
      className: [
        "[--banner-color-background:var(--color-brand-success-muted)] [--banner-color-text:var(--color-brand-success-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "success",
      className: [
        "[--banner-color-background:var(--color-brand-success-subtle)] [--banner-color-text:var(--color-brand-success-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "success",
      className: [
        "[--banner-color-background:var(--color-brand-success-bold)] [--banner-color-text:var(--color-brand-success-inverse)]",
      ],
    },
    // Neutral
    {
      emphasis: "muted",
      color: "neutral",
      className: [
        "[--banner-color-background:var(--color-brand-neutral-muted)] [--banner-color-text:var(--color-brand-neutral-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "neutral",
      className: [
        "[--banner-color-background:var(--color-brand-neutral-subtle)] [--banner-color-text:var(--color-brand-neutral-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "neutral",
      className: [
        "[--banner-color-background:var(--color-brand-neutral-bold)] [--banner-color-text:var(--color-brand-neutral-inverse)]",
      ],
    },
    //Info
    {
      emphasis: "muted",
      color: "info",
      className: [
        "[--banner-color-background:var(--color-brand-info-muted)] [--banner-color-text:var(--color-brand-info-text)]",
      ],
    },
    {
      emphasis: "subtle",
      color: "info",
      className: [
        "[--banner-color-background:var(--color-brand-info-subtle)] [--banner-color-text:var(--color-brand-info-text)]",
      ],
    },
    {
      emphasis: "bold",
      color: "info",
      className: [
        "[--banner-color-background:var(--color-brand-info-bold)] [--banner-color-text:var(--color-brand-info-inverse)]",
      ],
    },
  ],
  defaultVariants: {
    density: "default",
    color: "primary",
    emphasis: "muted",
  },
});

type BannerStyles = VariantProps<typeof bannerStyles>;

export function Banner({
  orientation,
  color = "info",
  emphasis = "muted",
  ...props
}: React.ComponentPropsWithoutRef<"section"> &
  Omit<SurfaceVariants, "color"> &
  BannerStyles) {
  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <section
        {...props}
        className={cn([
          props.className,
          //
          surfaceStyles({ orientation, color: "none" }),
          //
          bannerStyles({ color, emphasis }),
          // Override surface border color
          "[--surface-border-color:var(--banner-color-text)]",
          //
        ])}
      />
    </Provider>
  );
}
