import { Children } from "react";
import {
  Separator as AriaSeparator,
  type SeparatorProps as AriaSeparatorProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants/lite";
import { cn } from "./utils";

const dividerStyles = tv({
  base: "relative",
  slots: {
    // styles for when the divider haa children
    content: [
      // CSS Variables
      "[--child-position:50%] [--gap:theme(spacing.1)]",
      // Base
      "relative flex items-center border-0 text-center whitespace-nowrap",
      // :before border styles
      "before:relative before:[margin-inline-end:min(var(--child-position)*999,var(--gap))] before:basis-[var(--child-position)] before:[block-size:1px] dark:before:border-white/5",
      // :after border styles
      "after:relative after:[margin-inline-start:min((100%-var(--child-position))*999,var(--gap))] after:basis-[calc(100%-var(--child-position))] after:[block-size:1px] dark:before:border-white/5",
    ],
    // placeholder for "no content" so that we can manage the classnames
    default: "",
  },
  variants: {
    orientation: {
      vertical: {
        content: "",
        // default: "block shrink-0 list-none self-stretch border-l",
        default: "block shrink-0 list-none border-l",
      },
      horizontal: {
        content: "",
        default:
          "block shrink-0 list-none self-stretch border-t [block-size:1px]",
      },
    },
    subtle: {
      true: {
        content:
          "before:border-brand-neutral-subtle after:border-brand-neutral-subtle",
        default: "border-brand-neutral-subtle",
      },
      false: {
        content: "before:border-surface-border after:border-surface-border",
        default: "border-surface-border",
      },
    },
    inset: {
      unset: {
        base: "",
      },
      context: {
        base: "mx-(--inset) [--inset:calc(var(--gutter,var(--spacing-surface-gutter))*-1)]",
      },
    },
  },
  defaultVariants: {
    inset: "context",
    orientation: "horizontal",
    subtle: false,
  },
});

// eslint-disable-next-line @typescript-eslint/naming-convention
type _OwnProps = VariantProps<typeof dividerStyles>;
export type DividerProps = _OwnProps &
  AriaSeparatorProps & { children?: React.ReactNode };

export function Divider({
  subtle = false,
  orientation = "horizontal",
  className,
  inset,
  ...props
}: DividerProps) {
  const hasChildren = Children.count(props.children) !== 0;
  const {
    content,
    default: defaultSlot,
    base,
  } = dividerStyles({
    subtle,
    orientation,
    inset,
  });

  if (orientation === "vertical") {
    return (
      <AriaSeparator
        data-slot="divider"
        {...props}
        className={cn([
          base(),
          hasChildren ? content({ className }) : defaultSlot({ className }),
        ])}
      />
    );
  }

  return (
    <AriaSeparator
      data-slot="divider"
      {...props}
      className={cn([
        base(),
        hasChildren ? content({ className }) : defaultSlot({ className }),
      ])}
      style={{
        unicodeBidi: "isolate",
      }}
    />
  );
}
