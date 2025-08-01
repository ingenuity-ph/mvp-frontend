import { Children } from "react";
import { cn } from "./utils";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";

type Inset = "none" | "context";
const insetStyle: Record<Inset, string> = {
  none: "",
  context: cn([
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
} & AriaSeparatorProps & { children?: React.ReactNode }) {
  const hasChildren = Children.count(props.children) !== 0;

  if (orientation === "vertical") {
    return (
      <AriaSeparator
        data-slot="divider"
        {...props}
        className={cn(
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
                  "before:border-neutral-950/5 after:border-neutral-950/5 before:dark:border-white/5 after:dark:border-white/5",
                !soft &&
                  "before:border-surface-border after:border-surface-border before:dark:border-white/10 after:dark:border-white/10",
              ]
            : [
                // Base
                "block shrink-0 list-none self-stretch border-l",
                // Inset
                insetStyle[inset],
              ],
          soft && "border-neutral-950/5 dark:border-white/5",
          !soft && "border-surface-border dark:border-white/10"
        )}
      />
    );
  }

  return (
    <AriaSeparator
      data-slot="divider"
      {...props}
      style={{
        unicodeBidi: "isolate",
      }}
      className={cn(
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
                "before:border-neutral-950/5 after:border-neutral-950/5 before:dark:border-white/5 after:dark:border-white/5",
              !soft &&
                "before:border-surface-border after:border-surface-border before:dark:border-white/10 after:dark:border-white/10",
            ]
          : [
              // Base
              "block shrink-0 list-none self-stretch border-t [block-size:1px]",
              // Inset
              insetStyle[inset],
              // Colors
              soft && "border-neutral-950/5 dark:border-white/5",
              !soft && "border-surface-border",
            ]
      )}
    />
  );
}
