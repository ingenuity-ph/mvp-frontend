import React from "react";
import { mergeProps } from "react-aria";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Group,
  type GroupProps,
  Link,
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import type { ColorMap, Inset, Sizes, Variant } from "./constants";
import { ProgressCircle } from "./progress";
import { cn } from "./utils";

const baseButton = tv({
  base: [
    // Base
    "relative isolate inline-flex items-center justify-center gap-x-2 rounded-(--radius-btn) border text-base/6 font-semibold",
    // Padding
    "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)]",
    // Focus
    "focus:outline-2 focus:outline-offset-2 focus:outline-info-500",
    // Disabled
    "disabled:opacity-50",
    // Icon
    "forced-colors:(--btn-icon:ButtonText) forced-colors:hover:(--btn-icon:ButtonText) [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
    // Elevate button on focus when adjoined
    "focus:group-data-[adjoined]:z-10",
  ],
  variants: {
    shape: {
      pill: ["[--radius:9999px]"],
      default: "[--radius:var(--radius-btn)]",
    },
    size: {
      unset: [""],
      sm: [
        // Sizing (32px)
        "text-xs/6",
        "[--btn-padding-x:calc(theme(spacing[2.5])-1px)] [--btn-padding-y:calc(0)]",
      ],
      md: [
        // Sizing (36px)
        "text-sm/6",
        "[--btn-padding-x:calc(theme(spacing[3])-1px)] [--btn-padding-y:calc(--spacing(1.5)-1px)]",
      ],
      lg: [
        // Sizing (48px)
        "text-base",
        "[--btn-padding-x:calc(theme(spacing[5])-1px)] [--btn-padding-y:calc(theme(spacing[3])-1px)]",
      ],
    } satisfies Record<Sizes | "unset", Array<string>>,
    inset: {
      none: "",
      top: "mt-[calc(var(--btn-padding-y)*-1)]",
      right: "mr-[calc(var(--btn-padding-x)*-1)]",
      bottom: "mb-[calc(var(--btn-padding-y)*-1)]",
      left: "ml-[calc(var(--btn-padding-x)*-1)]",
      all: "mx-[calc(var(--btn-padding-x)*-1)] my-[calc(var(--btn-padding-y)*-1)]",
    } satisfies Record<Inset, Array<string> | string>,
  },
  defaultVariants: {
    inset: "none",
    intent: "default",
    size: "md",
    shape: "default",
  },
});

const solidButton = tv({
  extend: baseButton,
  base: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-(--btn-border)",
    // Dark mode: border is rendered on `after` so background is set to button background
    "dark:bg-(--btn-bg)",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-btn)-1px)] before:bg-(--btn-bg)",
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    "before:shadow",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    "dark:before:hidden",
    // Dark mode: Subtle white outline is applied using a border
    "dark:border-white/5",
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius-btn)-1px)]",
    // Inner highlight shadow
    "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
    // White overlay on hover
    "hover:after:bg-(--btn-hover-overlay) pressed:after:bg-(--btn-hover-overlay)",
    // Dark mode: `after` layer expands to cover entire button
    "dark:after:-inset-px dark:after:rounded-[var(--radius-btn)]",
    // Disabled
    "before:disabled:shadow-none after:disabled:shadow-none",
    // Adjoined
    // Border+Radius when adjoined :first-child
    "group-data-[adjoined]:group-data-[orientation=horizontal]:first:rounded-r-none group-data-[adjoined]:group-data-[orientation=horizontal]:first:border-r-0",
    "group-data-[adjoined]:group-data-[orientation=horizontal]:first:before:rounded-r-none",
    "group-data-[adjoined]:group-data-[orientation=horizontal]:first:after:rounded-r-none",
    // Orientation vertical
    "group-data-[adjoined]:group-data-[orientation=vertical]:first:rounded-b-none group-data-[adjoined]:group-data-[orientation=vertical]:first:border-b-0",
    "group-data-[adjoined]:group-data-[orientation=vertical]:first:before:rounded-b-none",
    "group-data-[adjoined]:group-data-[orientation=vertical]:first:after:rounded-b-none",

    // Adjoined :last-child
    "group-data-[adjoined]:group-data-[orientation=horizontal]:last:rounded-l-none group-data-[adjoined]:group-data-[orientation=horizontal]:last:border-l-0",
    "group-data-[adjoined]:group-data-[orientation=horizontal]:last:before:rounded-l-none",
    "group-data-[adjoined]:group-data-[orientation=horizontal]:last:after:rounded-l-none",
    // Orientation vertical
    // Radius
    "group-data-[adjoined]:group-data-[orientation=vertical]:last:rounded-t-none group-data-[adjoined]:group-data-[orientation=vertical]:last:before:rounded-t-none group-data-[adjoined]:group-data-[orientation=vertical]:last:after:rounded-t-none",

    // Adjoined not :first-child or :last-child
    // Remove radius when not :first-child or :last-child
    "group-data-[adjoined]:group-data-[orientation=vertical]:[&:not(:first-child)]:[&:not(:last-child)]:rounded-none",
    "group-data-[adjoined]:group-data-[orientation=vertical]:[&:not(:first-child)]:[&:not(:last-child)]:before:rounded-none",
    "group-data-[adjoined]:group-data-[orientation=vertical]:[&:not(:first-child)]:[&:not(:last-child)]:after:rounded-none",
    // Apply x-border width to children in between
    "group-data-[adjoined]:group-data-[orientation=horizontal]:[&:not(:first-child)]:[&:not(:last-child)]:border-l-0",
    // Orientation vertical
    // Apply top border width to children in between
    "group-data-[adjoined]:group-data-[orientation=vertical]:[&:not(:first-child)]:[&:not(:last-child)]:border-b-0",
  ],
  variants: {
    color: {
      none: "",
      primary: [
        "text-brand-primary-inverse [--btn-bg:var(--color-brand-primary)] [--btn-border:var(--color-brand-primary)]/90 [--btn-hover-overlay:var(--color-black)]/10",
        "dark:text-white dark:[--btn-bg:var(--color-brand-primary)]/90 dark:[--btn-hover-overlay:var(--color-black)]/5",
        "[--btn-icon:white] hover:[--btn-icon:theme(colors.brand-neutral.200)] pressed:[--btn-icon:theme(colors.brand-neutral.100)]",
      ],
      neutral: [
        "text-brand-neutral-text [--btn-bg:var(--color-brand-neutral-subtle)] [--btn-border:var(--color-neutral)]/90 [--btn-hover-overlay:var(--color-white)]/10",
        "dark:text-neutral-700 dark:[--btn-hover-overlay:var(--color-white)]/50%",
        "[--btn-icon:theme(colors.brand-neutral.500)] hover:[--btn-icon:theme(colors.brand-neutral.500)] pressed:[--btn-icon:theme(colors.brand-neutral.500)]",
      ],
      danger: [
        "text-brand-danger-inverse [--btn-bg:var(--color-brand-danger)] [--btn-border:var(--color-brand-danger)]/90 [--btn-hover-overlay:var(--color-white)]/10",
        "[--btn-icon:theme(colors.red.300)] hover:[--btn-icon:theme(colors.red.200)] pressed:[--btn-icon:theme(colors.red.200)]",
      ],
      warning: [
        "text-brand-warning-text [--btn-bg:var(--color-brand-warning-subtle)] [--btn-border:var(--color-brand-warning)]/90 [--btn-hover-overlay:var(--color-white)]/10",
        "[--btn-icon:theme(colors.yellow.600)] hover:[--btn-icon:theme(colors.yellow.700)] pressed:[--btn-icon:theme(colors.yellow.700)]",
      ],
      success: [
        "text-brand-success-inverse [--btn-bg:var(--color-brand-success)] [--btn-border:var(--color-brand-success)]/90 [--btn-hover-overlay:var(--color-white)]/10",
        "[--btn-icon:theme(colors.white/60%)] hover:[--btn-icon:theme(colors.white/80%)] pressed:[--btn-icon:theme(colors.white/80%)]",
      ],
      info: [
        "text-brand-info-inverse [--btn-bg:var(--color-brand-info)] [--btn-border:var(--color-brand-info-border)]/90 [--btn-hover-overlay:var(--color-white)]/10",
        "[--btn-icon:theme(colors.white/60%)] hover:[--btn-icon:theme(colors.white/80%)] pressed:[--btn-icon:theme(colors.white/80%)]",
      ],
    } satisfies ColorMap,
  },
});

const outlineButton = tv({
  extend: baseButton,
  base: [
    // Adjoined
    // Border+Radius when adjoined :first-child
    "group-data-[adjoined]:first:rounded-r-none group-data-[adjoined]:first:border-r-0",
    // Border+Radius when adjoined :last-child
    "group-data-[adjoined]:last:rounded-l-none group-data-[adjoined]:last:border-l-0",
    // Border+Radius when adjoined not :first-child or :last-child
    "group-data-[adjoined]:[&:not(:first-child)]:[&:not(:last-child)]:rounded-l-none group-data-[adjoined]:[&:not(:first-child)]:[&:not(:last-child)]:rounded-r-none group-data-[adjoined]:[&:not(:first-child)]:[&:not(:last-child)]:border-x-0",
  ],
  variants: {
    // TODO: Add back dark mode
    color: {
      none: "",
      primary: [
        // Base
        "border-brand-primary text-brand-primary-text hover:bg-brand-primary/5 pressed:bg-brand-primary-muted",
        // Icon
        "[--btn-icon:var(--color-brand-primary-text)]",
      ],
      neutral: [
        // Base
        "border-brand-neutral-border text-brand-neutral-text hover:bg-neutral-500/5 pressed:bg-brand-neutral-muted",
        // Icon
        "[--btn-icon:var(--color-brand-neutral-text)]",
      ],
      danger: [
        // Base
        "border-brand-danger text-brand-danger-text hover:bg-danger-500/5 pressed:bg-brand-danger-muted",
        // Icon
        "[--btn-icon:var(--color-brand-danger-text)]",
      ],
      warning: [
        // Base
        "border-brand-warning text-brand-warning-bold hover:bg-warning-500/5 pressed:bg-brand-warning-muted",
        // Icon
        "[--btn-icon:var(--color-brand-warning-text)]",
      ],
      success: [
        // Base
        "border-brand-success-text text-brand-success-bold hover:bg-success-500/5 pressed:bg-brand-success-muted",
        // Icon
        "[--btn-icon:var(--color-brand-success-text)]",
      ],
      info: [
        // Base
        "border-brand-info-text text-brand-info-bold hover:bg-info-500/5 pressed:bg-brand-info-muted",
        // Icon
        "[--btn-icon:var(--color-brand-info-text)]",
      ],
    } satisfies ColorMap,
  },
});

const plainButton = tv({
  extend: baseButton,
  base: [
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-[var(--btn-border)]",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-btn)-1px)] hover:before:bg-[var(--btn-hover-overlay)] pressed:before:bg-[var(--btn-pressed)]",
    // Adjoined
    // Border+Radius when adjoined :first-child
    "group-data-[adjoined]:first:before:rounded-r-none",
    // Border+Radius when adjoined :last-child
    "group-data-[adjoined]:last:before:rounded-l-none",
    // Border+Radius when adjoined not :first-child or :last-child
    "group-data-[adjoined]:[&:not(:first-child)]:[&:not(:last-child)]:before:rounded-l-none group-data-[adjoined]:[&:not(:first-child)]:[&:not(:last-child)]:before:rounded-r-none",
  ],
  variants: {
    color: {
      primary: [
        "text-brand-primary-text [--btn-hover-overlay:var(--color-brand-primary-muted)] [--btn-pressed:var(--color-primary-200)]",
        "[--btn-icon:var(--color-brand-primary-text)]",
      ],
      neutral: [
        "text-brand-neutral-text [--btn-hover-overlay:var(--color-brand-neutral-muted)] [--btn-pressed:var(--color-neutral-200)]",
        "[--btn-icon:var(--color-brand-neutral-text)]",
      ],
      danger: [
        "text-brand-danger-text [--btn-hover-overlay:var(--color-brand-danger-muted)] [--btn-pressed:var(--color-danger-200)]",
        "[--btn-icon:var(--color-brand-danger-text)]",
      ],
      warning: [
        "text-brand-warning-text [--btn-hover-overlay:var(--color-brand-warning-muted)] [--btn-pressed:var(--color-warning-200)]",
        "[--btn-icon:var(--color-brand-warning-text)]",
      ],
      success: [
        "text-brand-success-text [--btn-hover-overlay:var(--color-brand-success-muted)] [--btn-pressed:var(--color-success-200)]",
        "[--btn-icon:var(--color-brand-success-text)]",
      ],
      info: [
        "text-brand-info-text [--btn-hover-overlay:var(--color-brand-info-muted)] [--btn-pressed:var(--color-info-200)]",
        "[--btn-icon:var(--color-brand-info-text)]",
      ],
    } as ColorMap,
  },
});

export {
  baseButton as buttonStyles,
  outlineButton as outlineButtonStyles,
  plainButton as plainButtonStyles,
  solidButton as solidButtonStyles,
};

export type BaseButtonProps =
  | Omit<AriaButtonProps, "className">
  | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">;

type ExtendedVariant = Variant | "base";
type ButtonVariants = Omit<VariantProps<typeof solidButton>, "inset"> & {
  variant?: ExtendedVariant;
  inset?: Array<Inset> | Inset;
};

export type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  /**
   * For backwards compatibility.
   */
  onClick?: AriaButtonProps["onPress"];
} & ButtonVariants &
  BaseButtonProps;

export const Button = React.forwardRef(function Button(
  {
    color,
    className,
    children,
    size = "md",
    variant = "solid",
    shape,
    inset = "none",
    onClick,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const matchingInset = Array.isArray(inset)
    ? inset.map((item) => baseButton.variants.inset[item]).join(" ")
    : baseButton.variants.inset[inset];

  const variantClasses: Record<ExtendedVariant, string> = {
    solid: solidButton({ color: color ?? "primary", size, shape }),
    outline: outlineButton({ color: color ?? "neutral", size, shape }),
    plain: plainButton({ color: color ?? "neutral", size, shape }),
    base: baseButton({ shape }),
    unstyled: "relative",
  };
  const classes = cn(className, variantClasses[variant], matchingInset);

  if ("href" in props) {
    return (
      <Link
        {...props}
        className={cn([classes])}
        data-component="button"
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>{children}</TouchTarget>
      </Link>
    );
  }

  const isPending = "isPending" in props ? props.isPending : false;

  return (
    <AriaButton
      {...mergeProps(props, { onPress: onClick })}
      data-component="button"
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      style={props.style as AriaButtonProps["style"]}
      className={cn([classes, "cursor-default"])}
    >
      <TouchTarget>
        {isPending ? (
          <>
            <ProgressCircle />
            Loading
          </>
        ) : (
          children
        )}
      </TouchTarget>
    </AriaButton>
  );
});

/**
 * Expand the hit area to at least 44×44px on touch devices.
 */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}

export function ButtonGroup({
  children,
  adjoined = true,
  orientation = "horizontal",
  ...props
}: GroupProps & {
  children: React.ReactNode;
  adjoined?: boolean;
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <Group
      {...props}
      data-adjoined={adjoined ? "" : undefined}
      data-orientation={orientation}
      className={cn([
        props.className,
        // Base
        "group isolate inline-flex",
        // Orientation
        orientation === "vertical" && "flex-col",
        // Gap
        "[--btn-group-gutter:theme(spacing.2)]",
        !adjoined && "gap-[var(--btn-group-gutter)]",
      ])}
    >
      {children}
    </Group>
  );
}

type ToggleButtonProps = AriaToggleButtonProps & ButtonVariants;

/**
 * TODO: Figure out default styles for toggle button.
 */
export function ToggleButton({
  shape = "default",
  inset = "none",
  size = "md",
  variant = "solid",
  color,
  className,
  ...props
}: ToggleButtonProps) {
  const matchingInset = Array.isArray(inset)
    ? inset.map((item) => baseButton.variants.inset[item]).join(" ")
    : baseButton.variants.inset[inset];

  const variantClasses: Record<ExtendedVariant, string> = {
    solid: solidButton({ color: color ?? "primary", size, shape }),
    outline: outlineButton({ color: color ?? "neutral", size, shape }),
    plain: plainButton({ color: color ?? "neutral", size, shape }),
    base: baseButton(),
    unstyled: "relative",
  };

  const classes = cn(className, variantClasses[variant], matchingInset);

  return (
    <AriaToggleButton {...props} data-component="button" className={classes} />
  );
}
