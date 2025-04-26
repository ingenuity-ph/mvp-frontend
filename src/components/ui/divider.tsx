import clsx from "clsx";
import { Children } from "react";
type Inset = "none" | "context";
const insetStyle: Record<Inset, string> = {
  none: "",
  context: clsx([
    "[--inset:calc(var(--gutter,theme(spacing.4))*-1)] [margin-inline:var(--inset)]",
  ]),
};

export function Divider({
  soft = false,
  orientation = "horizontal",
  className,
  inset = "context",
  ...props
}: {
  soft?: boolean;
  orientation?: "horizontal" | "vertical";
  inset?: Inset;
} & React.ComponentPropsWithoutRef<"div">) {
  const hasChildren = Children.count(props.children) !== 0;

  if (orientation === "vertical") {
    return (
      <div
        {...props}
        role="separator"
        className={clsx(
          className,
          hasChildren
            ? [
                // CSS Variables
                "[--child-position:50%] [--gap:theme(spacing.1)]",
                // Base
                "relative flex items-center whitespace-nowrap border-0 text-center",
                // :before border styles
                "before:relative before:basis-[var(--child-position)] before:[block-size:1px] before:[margin-inline-end:min(var(--child-position)*999,var(--gap))] dark:before:border-white/5",
                // :after border styles
                "after:relative after:basis-[calc(100%-var(--child-position))] after:[block-size:1px] after:[margin-inline-start:min((100%-var(--child-position))*999,var(--gap))] dark:before:border-white/5",
                // Colors
                soft &&
                  "before:border-zinc-950/5 after:border-zinc-950/5 before:dark:border-white/5 after:dark:border-white/5",
                !soft &&
                  "before:border-zinc-950/10 after:border-zinc-950/10 before:dark:border-white/10 after:dark:border-white/10",
              ]
            : [
                // Base
                "block shrink-0 list-none self-stretch border-l",
                // Inset
                insetStyle[inset],
              ],
          soft && "border-zinc-950/5 dark:border-white/5",
          !soft && "border-zinc-950/10 dark:border-white/10",
        )}
      />
    );
  }

  return (
    <div
      {...props}
      role="separator"
      style={{
        unicodeBidi: "isolate",
      }}
      className={clsx(
        className,
        // Base
        "relative shrink-0 self-stretch",
        // Inset
        hasChildren
          ? [
              // CSS Variables
              "[--child-position:50%] [--gap:theme(spacing.1)]",
              // Base
              "relative flex items-center whitespace-nowrap border-0 text-center",
              // :before border styles
              "before:relative before:basis-[var(--child-position)] before:[block-size:1px] before:[margin-inline-end:min(var(--child-position)*999,var(--gap))] dark:before:border-white/5",
              // :after border styles
              "after:relative after:basis-[calc(100%-var(--child-position))] after:[block-size:1px] after:[margin-inline-start:min((100%-var(--child-position))*999,var(--gap))] dark:before:border-white/5",
              // Colors
              soft &&
                "before:border-zinc-950/5 after:border-zinc-950/5 before:dark:border-white/5 after:dark:border-white/5",
              !soft &&
                "before:border-zinc-950/10 after:border-zinc-950/10 before:dark:border-white/10 after:dark:border-white/10",
            ]
          : [
              // Base
              "block shrink-0 list-none self-stretch border-t [block-size:1px]",
              // Inset
              insetStyle[inset],
              // Colors
              soft && "border-zinc-950/5 dark:border-white/5",
              !soft && "border-brand-border",
            ],
      )}
    />
  );
}
