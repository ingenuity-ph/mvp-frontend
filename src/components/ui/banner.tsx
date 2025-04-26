import type React from "react";
import { LabelContext, Provider } from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import { surfaceStyles, type SurfaceVariants } from "./surface";
import { cn } from "./utils";

// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/no-unused-vars
const DENSITY = Object.freeze({
  compact: "compact",
  default: "default",
  spacious: "spacious",
} as const);

type Density = keyof typeof DENSITY;

const bannerStyles = tv({
  variants: {
    density: {
      default: ["[--gutter:theme(spacing.4)]"],
      compact: ["[--gutter:theme(spacing.2)]"],
      spacious: ["[--gutter:theme(spacing.8)]"],
    } satisfies Record<Density, Array<string>>,
  },
  defaultVariants: {
    density: "compact",
  },
});

type BannerStyles = VariantProps<typeof bannerStyles>;

export function Banner({
  orientation,
  density,
  ...props
}: React.ComponentPropsWithoutRef<"section"> &
  SurfaceVariants &
  Pick<BannerStyles, "density">) {
  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <section
        {...props}
        className={cn(props.className, surfaceStyles({ orientation }), [
          // Default variables
          bannerStyles({ density }),
          // Define grid at the root level if subgrid is supported
          "supports-[grid-template-columns:subgrid]:grid supports-[grid-template-columns:subgrid]:grid-cols-[auto_1fr_auto]",
          // Icons
          "[&>[data-slot=icon]]:col-start-1 [&>[data-slot=icon]]:row-start-1 [&>[data-slot=icon]]:mt-1 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:sm:size-4",
          "[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:data-[focus]:text-white [&>[data-slot=icon]]:dark:text-zinc-400 [&>[data-slot=icon]]:data-[focus]:dark:text-white",
        ])}
      />
    </Provider>
  );
}

export function BannerContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn([
        className,
        // Use subgrid when available but fallback to an explicit grid layout if not
        "col-span-1 grid grid-cols-[auto_1fr_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
        // Label layout
        "[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1",
        // Description layout
        "[&>[data-slot=description]]:col-span-2 [&>[data-slot=description]]:col-start-1",
      ])}
    />
  );
}

export function BannerFooter({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn([
        className,
        // Use subgrid when available but fallback to an explicit grid layout if not
        "col-span-2 col-start-2 grid grid-cols-[auto_1fr_auto] items-center supports-[grid-template-columns:subgrid]:grid-cols-subgrid",
      ])}
    />
  );
}
