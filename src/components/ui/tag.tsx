import React, { type Ref } from "react";
import { tv, type VariantProps } from "tailwind-variants";
import { Button, TouchTarget, type ButtonProps } from "./button";
import type { ColorMap } from "./constants";
import { cn } from "./utils";

const tagStyles = tv({
  variants: {
    color: {
      none: "",
      primary: [
        "bg-brand-primary-muted text-brand-primary-text group-data-[hovered]:bg-primary-500/25 dark:bg-primary-500/10 dark:text-primary-400 dark:group-data-[hovered]:bg-primary-500/20",
      ],
      neutral: [
        "bg-brand-neutral-muted text-brand-neutral-text group-data-[hovered]:bg-neutral-500/25 dark:bg-neutral-500/10 dark:text-neutral-400 dark:group-data-[hovered]:bg-neutral-500/20",
      ],
      danger: [
        "bg-brand-danger-muted text-brand-danger-text group-data-[hovered]:bg-danger-500/25 dark:bg-danger-500/10 dark:text-danger-400 dark:group-data-[hovered]:bg-danger-500/20",
      ],
      warning: [
        "bg-brand-warning-muted text-brand-warning-text group-data-[hovered]:bg-warning-500/25 dark:bg-warning-500/10 dark:text-warning-400 dark:group-data-[hovered]:bg-warning-500/20",
      ],
      success: [
        "bg-brand-success-muted text-brand-success-text group-data-[hovered]:bg-success-500/25 dark:bg-success-500/10 dark:text-success-400 dark:group-data-[hovered]:bg-success-500/20",
      ],
      info: [
        "bg-brand-info-muted text-brand-info-text group-data-[hovered]:bg-info-500/25 dark:bg-info-500/10 dark:text-info-400 dark:group-data-[hovered]:bg-info-500/20",
      ],
    } satisfies ColorMap,
  },
});

type TagVariants = VariantProps<typeof tagStyles>;
type TagProps = TagVariants;

export function Tag({
  color = "neutral",
  className,
  ...props
}: TagProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(
        className,
        "inline-flex items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
        // Icon
        "forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hovered]:[--btn-icon:ButtonText] [&_[data-slot=icon]]:-mx-0.5 [&_[data-slot=icon]]:my-0.5 [&_[data-slot=icon]]:size-5 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:text-[--btn-icon] [&_[data-slot=icon]]:sm:my-1 [&_[data-slot=icon]]:sm:size-4",
        //
        tagStyles({ color })
      )}
    />
  );
}

export const TagButton = React.forwardRef(function TagButton(
  { color = "neutral", className, children, ...props }: TagProps & ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const classes = cn(
    className,
    "group relative inline-flex rounded-md focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-500 focus:outline-none"
  );

  return (
    <Button
      {...props}
      variant="unstyled"
      className={classes}
      ref={ref as Ref<HTMLButtonElement>}
    >
      <TouchTarget>
        <Tag color={color}>{children}</Tag>
      </TouchTarget>
    </Button>
  );
});
