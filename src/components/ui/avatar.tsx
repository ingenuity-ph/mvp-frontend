import React from "react";
import type { Link } from "react-aria-components";
import { tv } from "tailwind-variants";
import { type BaseButtonProps, Button } from "./button";
import type { Shape, VariantConfigMap } from "./constants";
import { cn } from "./utils";

interface AvatarProps {
  src?: string | null;
  initials?: string;
  alt?: string;
  className?: string;
  shape?: Shape;
}

const avatar = tv({
  base: [
    // Basic layout
    "inline-grid shrink-0 align-middle [--avatar-radius:20%] [--ring-opacity:20%] *:col-start-1 *:row-start-1",
    "outline -outline-offset-1 outline-black/[--ring-opacity] dark:outline-white/[--ring-opacity]",
  ],
  variants: {
    // Add the correct border radius
    shape: {
      square: "rounded-[--avatar-radius] *:rounded-[--avatar-radius]",
      circle: "rounded-full *:rounded-full",
    } satisfies VariantConfigMap<Shape>,
  },
  defaultVariants: {
    shape: "circle",
  },
});

export function Avatar({
  src = null,
  shape = "circle",
  initials,
  alt = "",
  className,
  ...props
}: AvatarProps & React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      data-slot="avatar"
      {...props}
      className={avatar({ shape, className })}
    >
      {initials && (
        <svg
          className="size-full fill-current p-[5%] text-[48px] font-medium uppercase select-none"
          viewBox="0 0 100 100"
          aria-hidden={alt ? undefined : "true"}
        >
          {alt && <title>{alt}</title>}
          <text
            x="50%"
            y="50%"
            alignmentBaseline="middle"
            dominantBaseline="middle"
            textAnchor="middle"
            dy=".125em"
          >
            {initials}
          </text>
        </svg>
      )}
      {src && <img className="size-full" src={src} alt={alt} />}
    </span>
  );
}

export const AvatarButton = React.forwardRef(function AvatarButton(
  {
    src,
    shape = "circle",
    initials,
    alt,
    className,
  }: AvatarProps &
    (
      | Omit<BaseButtonProps, "className">
      | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
    ),
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const classes = cn(
    className,
    "relative inline-grid focus:outline-none focus:outline-offset-2 focus:outline-blue-500"
  );

  return (
    <Button variant="unstyled" className={classes} ref={ref}>
      <Avatar src={src} shape={shape} initials={initials} alt={alt} />
    </Button>
  );
});
