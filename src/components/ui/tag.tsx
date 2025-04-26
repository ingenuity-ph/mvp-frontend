import React, { type Ref } from "react";
import {
  Button as AriaButton,
  type ButtonProps,
  Link,
} from "react-aria-components";
import { TouchTarget } from "./button";
import type { ColorMap } from "./constants";
import { cn } from "./utils";

const colors = {
  primary:
    "bg-brand-primary-600/10 text-brand-primary-700 group-data-[hovered]:bg-brand-primary-600/20 dark:bg-white/5 dark:text-brand-primary-400 dark:group-data-[hovered]:bg-white/10",
  secondary:
    "bg-brand-secondary-600/10 text-brand-secondary-700 group-data-[hovered]:bg-brand-secondary-600/20 dark:bg-brand-secondary/20 dark:text-brand-secondary-400 dark:group-data-[hovered]:bg-white/10",
  neutral:
    "bg-zinc-600/10 text-zinc-700 group-data-[hovered]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hovered]:bg-white/10",
  // TODO: Add styles for this
  dark: "",
  light: "",
  danger:
    "bg-red-500/15 text-red-700 group-data-[hovered]:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-[hovered]:bg-red-500/20",
  warning:
    "bg-yellow-400/20 text-yellow-700 group-data-[hovered]:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-[hovered]:bg-yellow-400/15",
  success:
    "bg-green-500/15 text-green-700 group-data-[hovered]:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-[hovered]:bg-green-500/20",
  info: "bg-sky-500/15 text-sky-700 group-data-[hovered]:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-[hovered]:bg-sky-500/20",
} satisfies ColorMap;

interface TagProps {
  color?: keyof typeof colors;
}

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
        colors[color],
      )}
    />
  );
}

export const TagButton = React.forwardRef(
  // eslint-disable-next-line prefer-arrow-callback
  function TagButton(
    {
      color = "neutral",
      className,
      children,
      ...props
    }: TagProps & { className?: string; children: React.ReactNode } & (
        | Omit<ButtonProps, "className">
        | Omit<React.ComponentPropsWithoutRef<typeof Link>, "className">
      ),
    ref: React.ForwardedRef<HTMLElement>,
  ) {
    const classes = cn(
      className,
      "group relative inline-flex rounded-md data-[focus]:outline data-[focus]:outline-2 data-[focus]:outline-offset-2 data-[focus]:outline-blue-500 focus:outline-none",
    );

    return "href" in props ? (
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
      >
        <TouchTarget>
          <Tag color={color}>{children}</Tag>
        </TouchTarget>
      </Link>
    ) : (
      <AriaButton
        {...props}
        style={props.style as ButtonProps["style"]}
        className={classes}
        ref={ref as Ref<HTMLButtonElement>}
      >
        <TouchTarget>
          <Tag color={color}>{children}</Tag>
        </TouchTarget>
      </AriaButton>
    );
  },
);

// const textTagcolors = {
//   primary:
//     "text-zinc-700 group-data-[hovered]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hovered]:bg-white/10",
//   secondary:
//     "text-zinc-700 group-data-[hovered]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hovered]:bg-white/10",
//   neutral:
//     "text-zinc-700 group-data-[hovered]:bg-zinc-600/20 dark:bg-white/5 dark:text-zinc-400 dark:group-data-[hovered]:bg-white/10",
//   dark: "",
//   light: "",
//   danger:
//     "text-red-700 group-data-[hovered]:bg-red-500/25 dark:bg-red-500/10 dark:text-red-400 dark:group-data-[hovered]:bg-red-500/20",
//   warning:
//     "text-yellow-700 group-data-[hovered]:bg-yellow-400/30 dark:bg-yellow-400/10 dark:text-yellow-300 dark:group-data-[hovered]:bg-yellow-400/15",
//   success:
//     "text-green-700 group-data-[hovered]:bg-green-500/25 dark:bg-green-500/10 dark:text-green-400 dark:group-data-[hovered]:bg-green-500/20",
//   info: "text-sky-700 group-data-[hovered]:bg-sky-500/25 dark:bg-sky-500/10 dark:text-sky-300 dark:group-data-[hovered]:bg-sky-500/20",
// } satisfies ColorMap;

// export const TextTag = React.forwardRef(
//   (
//     {
//       color = "neutral",
//       className,
//       children,
//       ...props
//     }: TagProps & React.ComponentPropsWithoutRef<"span">,
//     ref,
//   ) => {
//     return (
//       <EnhancerGroup
//         {...props}
//         className={cn([
//           className,
//           "rounded-md text-base/5 font-medium sm:text-sm/5 forced-colors:outline",
//           textTagcolors[color],
//         ])}
//       >
//         {children}
//       </EnhancerGroup>
//     );
//   },
// );
