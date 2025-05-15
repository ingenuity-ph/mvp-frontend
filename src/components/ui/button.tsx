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
import type { ColorMap, Inset, SizeMap, Variant } from "./constants";
import { ProgressCircle } from "./progress";
import { cn } from "./utils";

const baseButton = tv({
  base: [
    // Base
    "relative isolate inline-flex items-center justify-center gap-x-2 rounded-(--radius) border text-base/6 font-semibold",
    // Focus
    "focus:outline-none focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500",
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
      default: "[--radius:var(--btn-radius)]",
    },
    size: {
      sm: [
        // Sizing (32px)
        "[--btn-padding-x:calc(theme(spacing[2.5])-1px)] [--btn-padding-y:calc(theme(spacing.[1])-1px)]",
        "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] text-xs/6",
      ],
      md: [
        // Sizing (36px)
        "[--btn-padding-x:calc(theme(spacing[3.5])-1px)] [--btn-padding-y:calc(theme(spacing[2.5])-1px)]",
        "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] sm:px-[calc(theme(spacing.3)-1px)] sm:py-[calc(theme(spacing[1.5])-1px)] sm:text-sm/6",
      ],
      lg: [
        // Sizing (48px)
        "[--btn-padding-x:calc(theme(spacing[5])-1px)] [--btn-padding-y:calc(theme(spacing[3])-1px)]",
        "px-[var(--btn-padding-x)] py-[var(--btn-padding-y)] text-base",
      ],
    } satisfies SizeMap,
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
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius)-1px)] before:bg-(--btn-bg)",
    // Drop shadow, applied to the inset `before` layer so it blends with the border
    "before:shadow",
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    "dark:before:hidden",
    // Dark mode: Subtle white outline is applied using a border
    "dark:border-white/5",
    // Shim/overlay, inset to match button foreground and used for hover state + highlight shadow
    "after:absolute after:inset-0 after:-z-10 after:rounded-[calc(var(--radius)-1px)]",
    // Inner highlight shadow
    "after:shadow-[shadow:inset_0_1px_theme(colors.white/15%)]",
    // White overlay on hover
    "hover:after:bg-(--btn-hover-overlay) pressed:after:bg-(--btn-hover-overlay)",
    // Dark mode: `after` layer expands to cover entire button
    "dark:after:-inset-px dark:after:rounded-[var(--radius)]",
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
      primary: [
        "text-white [--btn-bg:var(--color-brand-primary)] [--btn-border:var(--color-brand-primary)]/90 [--btn-hover-overlay:var(--color-black)]/10",
        "dark:text-white dark:[--btn-bg:var(--color-brand-primary)]/90 dark:[--btn-hover-overlay:var(--color-black)]/5",
        "[--btn-icon:white] hover:[--btn-icon:theme(colors.zinc.200)] pressed:[--btn-icon:theme(colors.zinc.100)]",
      ],
      secondary: [
        "text-white [--btn-bg:theme(colors.brand.secondary.DEFAULT)] [--btn-border:theme(colors.brand.secondary.DEFAULT/90%)] [--btn-hover-overlay:var(--color-black/10%)]",
        "dark:text-white dark:[--btn-bg:theme(colors.brand.secondary.DEFAULT/90%)] dark:[--btn-hover-overlay:var(--color-black/5%)]",
        "[--btn-icon:white] hover:[--btn-icon:theme(colors.zinc.200)] pressed:[--btn-icon:theme(colors.zinc.100)]",
      ],
      dark: [
        "text-white [--btn-bg:theme(colors.zinc.900)] [--btn-border:theme(colors.zinc.950/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
        "dark:[--btn-bg:theme(colors.zinc.800)] dark:[--btn-hover-overlay:theme(colors.white/5%)]",
        "[--btn-icon:theme(colors.zinc.400)] hover:[--btn-icon:theme(colors.zinc.300)] pressed:[--btn-icon:theme(colors.zinc.300)]",
      ],
      light: [
        "text-zinc-950 [--btn-bg:white] [--btn-border:theme(colors.zinc.950/10%)] [--btn-hover-overlay:theme(colors.zinc.950/2.5%)] hover:[--btn-border:theme(colors.zinc.950/15%)] pressed:[--btn-border:theme(colors.zinc.950/15%)]",
        "dark:[--btn-hover-overlay:theme(colors.zinc.950/5%)]",
        "[--btn-icon:theme(colors.zinc.400)] hover:[--btn-icon:theme(colors.zinc.500)] pressed:[--btn-icon:theme(colors.zinc.500)]",
      ],
      neutral: [
        "text-zinc-500 [--btn-bg:theme(colors.zinc.200)] [--btn-border:theme(colors.zinc.300/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
        "dark:text-zinc-700 dark:[--btn-hover-overlay:theme(colors.white/50%)]",
        "[--btn-icon:theme(colors.zinc.500)] hover:[--btn-icon:theme(colors.zinc.500)] pressed:[--btn-icon:theme(colors.zinc.500)]",
      ],
      danger: [
        "text-white [--btn-bg:theme(colors.red.600)] [--btn-border:theme(colors.red.700/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
        "[--btn-icon:theme(colors.red.300)] hover:[--btn-icon:theme(colors.red.200)] pressed:[--btn-icon:theme(colors.red.200)]",
      ],
      warning: [
        "text-yellow-950 [--btn-bg:theme(colors.yellow.300)] [--btn-border:theme(colors.yellow.400/80%)] [--btn-hover-overlay:theme(colors.white/25%)]",
        "[--btn-icon:theme(colors.yellow.600)] hover:[--btn-icon:theme(colors.yellow.700)] pressed:[--btn-icon:theme(colors.yellow.700)]",
      ],
      success: [
        "text-white [--btn-bg:theme(colors.green.600)] [--btn-border:theme(colors.green.700/90%)] [--btn-hover-overlay:theme(colors.white/10%)]",
        "[--btn-icon:theme(colors.white/60%)] hover:[--btn-icon:theme(colors.white/80%)] pressed:[--btn-icon:theme(colors.white/80%)]",
      ],
      info: [
        "text-white [--btn-bg:theme(colors.sky.500)] [--btn-border:theme(colors.sky.600/80%)] [--btn-hover-overlay:theme(colors.white/10%)]",
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
    color: {
      primary: [
        // Base
        "border-brand-primary-700/10 text-brand-primary-700 hover:bg-brand-primary-500/5 pressed:bg-brand-primary-950/10",
        // Dark Mode
        "dark:border-brand-primary-500/15 dark:text-brand-primary-500 dark:[--btn-bg:transparent] dark:hover:bg-brand-primary-500/5 dark:pressed:bg-brand-primary-500/5",
        // Icon
        "[--btn-icon:theme(colors.brand.primary.500)] hover:[--btn-icon:theme(colors.brand.primary.700)] pressed:[--btn-icon:theme(colors.brand.primary.700)] dark:hover:[--btn-icon:theme(colors.brand.primary.400)] dark:pressed:[--btn-icon:theme(colors.brand.primary.400)]",
      ],
      secondary: [
        // Base
        "border-brand-secondary-700/10 text-brand-secondary-700 hover:bg-brand-secondary-500/5 pressed:bg-brand-secondary-950/10",
        // Dark Mode
        "dark:border-brand-secondary-500/15 dark:text-brand-secondary-500 dark:[--btn-bg:transparent] dark:hover:bg-brand-secondary-500/5 dark:pressed:bg-brand-secondary-500/5",
        // Icon
        "[--btn-icon:theme(colors.brand.secondary.500)] hover:[--btn-icon:theme(colors.brand.secondary.700)] pressed:[--btn-icon:theme(colors.brand.secondary.700)] dark:hover:[--btn-icon:theme(colors.brand.secondary.400)] dark:pressed:[--btn-icon:theme(colors.brand.secondary.400)]",
      ],
      dark: [
        "border-zinc-800 text-zinc-800 hover:bg-zinc-500/5 pressed:bg-zinc-950/10",
        // Dark Mode
        "dark:border-zinc-400 dark:[--btn-bg:transparent] dark:hover:bg-zinc-500/5 dark:pressed:bg-zinc-500/5",
        // Icon
        "[--btn-icon:theme(colors.zinc.700)] hover:[--btn-icon:theme(colors.zinc.800)] pressed:[--btn-icon:theme(colors.zinc.700)] dark:hover:[--btn-icon:theme(colors.zinc.400)] dark:pressed:[--btn-icon:theme(colors.zinc.400)]",
      ],
      light: [
        // Base
        "border-white/10 text-white hover:bg-zinc-500/5 pressed:bg-zinc-950/10",
        // Dark Mode
        "dark:border-zinc-400 dark:[--btn-bg:transparent] dark:hover:bg-zinc-500/5 dark:pressed:bg-zinc-500/5",
        // Icon
        "[--btn-icon:theme(colors.white)] hover:[--btn-icon:theme(colors.zinc.200)] pressed:[--btn-icon:theme(colors.zinc.100)] dark:hover:[--btn-icon:theme(colors.zinc.400)] dark:pressed:[--btn-icon:theme(colors.zinc.400)]",
      ],
      neutral: [
        // Base
        "border-brand-border text-neutral-700 hover:bg-neutral-500/5 pressed:bg-neutral-950/10",
        // Dark Mode
        "dark:border-neutral-500/20 dark:text-neutral-400 dark:[--btn-bg:transparent] dark:hover:bg-neutral-500/5 dark:pressed:bg-neutral-500/5",
        // Icon
        "[--btn-icon:theme(colors.neutral.500)] hover:[--btn-icon:theme(colors.neutral.700)] pressed:[--btn-icon:theme(colors.neutral.700)] dark:hover:[--btn-icon:theme(colors.neutral.400)] dark:pressed:[--btn-icon:theme(colors.neutral.400)]",
      ],
      danger: [
        // Base
        "border-red-700/10 text-red-700 hover:bg-red-500/5 pressed:bg-red-950/10",
        // Dark Mode
        "dark:border-red-500/15 dark:text-red-500 dark:[--btn-bg:transparent] dark:hover:bg-red-500/5 dark:pressed:bg-red-500/5",
        // Icon
        "[--btn-icon:theme(colors.red.500)] hover:[--btn-icon:theme(colors.red.700)] pressed:[--btn-icon:theme(colors.red.700)] dark:hover:[--btn-icon:theme(colors.red.400)] dark:pressed:[--btn-icon:theme(colors.red.400)]",
      ],
      warning: [
        // Base
        "border-yellow-700/10 text-yellow-700 hover:bg-yellow-500/5 pressed:bg-yellow-950/10",
        // Dark Mode
        "dark:border-yellow-500/15 dark:text-yellow-500 dark:[--btn-bg:transparent] dark:hover:bg-yellow-500/5 dark:pressed:bg-yellow-500/5",
        // Icon
        "[--btn-icon:theme(colors.yellow.500)] hover:[--btn-icon:theme(colors.yellow.700)] pressed:[--btn-icon:theme(colors.yellow.700)] dark:hover:[--btn-icon:theme(colors.yellow.400)] dark:pressed:[--btn-icon:theme(colors.yellow.400)]",
      ],
      success: [
        // Base
        "border-green-700/10 text-green-700 hover:bg-green-500/5 pressed:bg-green-950/10",
        // Dark Mode
        "dark:border-green-500/15 dark:text-green-500 dark:[--btn-bg:transparent] dark:hover:bg-green-500/5 dark:pressed:bg-green-500/5",
        // Icon
        "[--btn-icon:theme(colors.green.500)] hover:[--btn-icon:theme(colors.green.700)] pressed:[--btn-icon:theme(colors.green.700)] dark:hover:[--btn-icon:theme(colors.green.400)] dark:pressed:[--btn-icon:theme(colors.green.400)]",
      ],
      info: [
        // Base
        "border-sky-700/10 text-sky-700 hover:bg-sky-500/5 pressed:bg-sky-950/10",
        // Dark Mode
        "dark:border-sky-500/15 dark:text-sky-500 dark:[--btn-bg:transparent] dark:hover:bg-sky-500/5 dark:pressed:bg-sky-500/5",
        // Icon
        "[--btn-icon:theme(colors.sky.500)] hover:[--btn-icon:theme(colors.sky.700)] pressed:[--btn-icon:theme(colors.sky.700)] dark:hover:[--btn-icon:theme(colors.sky.400)] dark:pressed:[--btn-icon:theme(colors.sky.400)]",
      ],
    } satisfies ColorMap,
  },
});

const plainButton = tv({
  extend: baseButton,
  base: [
    // Default Variables
    "[--btn-bg:transparent] [--btn-border:transparent]",
    // Optical border, implemented as the button background to avoid corner artifacts
    "border-transparent bg-[var(--btn-border)]",
    // Button background, implemented as foreground layer to stack on top of pseudo-border layer
    "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius)-1px)] hover:before:bg-[var(--btn-hover-overlay)] pressed:before:bg-[var(--btn-pressed)]",
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
        "text-brand-primary-600 [--btn-hover-overlay:theme(colors.brand.primary.500/10%)] [--btn-pressed:theme(colors.brand.primary.200)]",
        "[--btn-icon:theme(colors.brand.primary.600)]",
      ],
      secondary: [
        "text-brand-secondary-600 [--btn-hover-overlay:theme(colors.brand.secondary.500/10%)] [--btn-pressed:theme(colors.brand.secondary.200)]",
        "[--btn-icon:theme(colors.brand.secondary.600)]",
      ],
      dark: [
        "text-zinc-900 [--btn-hover-overlay:theme(colors.zinc.950/5%)] [--btn-pressed:theme(colors.zinc.950/10%)]",
        "[--btn-icon:theme(colors.zinc.900)]",
      ],
      light: [
        "text-white [--btn-hover-overlay:theme(colors.white/10%)] [--btn-pressed:theme(colors.zinc.950/10%)] hover:text-zinc-100",
        "[--btn-icon:theme(colors.white)]",
      ],
      neutral: [
        "text-zinc-950 [--btn-hover-overlay:theme(colors.zinc.950/5%)] [--btn-pressed:theme(colors.zinc.950/10%)]",
        "[--btn-icon:theme(colors.zinc.500)] dark:text-zinc-400 dark:[--btn-hover-overlay:theme(colors.zinc.500/5%)] dark:[--btn-pressed:theme(colors.zinc.500/10%)]",
      ],
      danger: [
        "text-red-600 [--btn-hover-overlay:theme(colors.red.500/10%)] [--btn-pressed:theme(colors.red.200)]",
        "[--btn-icon:theme(colors.red.600)]",
      ],
      warning: [
        "text-yellow-600 [--btn-hover-overlay:theme(colors.yellow.500/10%)] [--btn-pressed:theme(colors.yellow.200)]",
        "[--btn-icon:theme(colors.yellow.600)]",
      ],
      success: [
        "text-green-600 [--btn-hover-overlay:theme(colors.green.500/10%)] [--btn-pressed:theme(colors.green.200)]",
        "[--btn-icon:theme(colors.green.600)]",
      ],
      info: [
        "text-sky-600 [--btn-hover-overlay:theme(colors.sky.500/10%)] [--btn-pressed:theme(colors.sky.200)]",
        "[--btn-icon:theme(colors.sky.600)]",
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

type ExtendedVariant = Variant;
type ButtonVariants = Omit<VariantProps<typeof solidButton>, "inset"> & {
  variant?: ExtendedVariant;
  inset?: Array<Inset> | Inset;
};

export type ButtonProps = {
  className?: string;
  children: React.ReactNode;
  /**
   * For compatibility.
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
    unstyled: "relative",
  };

  const classes = cn(className, variantClasses[variant], matchingInset);

  return (
    <AriaToggleButton {...props} data-component="button" className={classes} />
  );
}
