import { clsx } from "clsx";
import { forwardRef } from "react";
import { mergeProps } from "react-aria";
import {
  Button,
  LabelContext,
  ListBox,
  ListBoxItem,
  type ListBoxItemProps,
  Popover,
  Provider,
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  SelectValue,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import type { Adjoined } from "./constants";
import { FieldContext, FieldControllerContext } from "./fieldset";
import type { forwardRefType } from "./utils";

const adjoinedStyles = tv({
  variants: {
    direction: {
      none: [],
      top: [
        // Root
        "data-[adjoined=top]:before:rounded-t-none data-[adjoined=top]:after:rounded-t-none",
        // Input
        "[&_[data-component=select]]:data-[adjoined=top]:rounded-t-none",
        // Border
        "[&_[data-component=select]]:data-[adjoined=top]:border-t-0",
      ],
      right: [
        // Root
        "data-[adjoined=right]:before:rounded-r-none data-[adjoined=right]:after:rounded-r-none",
        // Input
        "[&_[data-component=select]]:data-[adjoined=right]:rounded-r-none",
        // Border
        "[&_[data-component=select]]:data-[adjoined=right]:border-r-0",
      ],
      bottom: [
        // Root
        "data-[adjoined=bottom]:before:rounded-b-none data-[adjoined=bottom]:after:rounded-b-none",
        // Input
        "[&_[data-component=select]]:data-[adjoined=bottom]:rounded-b-none",
        // Border
        "[&_[data-component=select]]:data-[adjoined=bottom]:border-b-0",
      ],
      left: [
        // Root
        "data-[adjoined=left]:before:rounded-l-none data-[adjoined=left]:after:rounded-l-none",
        // Input
        "[&_[data-component=select]]:data-[adjoined=left]:rounded-l-none",
        // Border
        "[&_[data-component=select]]:data-[adjoined=left]:border-l-0",
      ],
    } satisfies Record<Adjoined, Array<string>>,
  },
});

function Select<T extends object>(
  {
    className,
    children,
    adjoined = "none",
    items,
    ...props
  }: {
    className?: string;
    adjoined?: Adjoined;
    items?: Iterable<T>;
    children: React.ReactNode | ((item: T) => React.ReactNode);
  } & Omit<AriaSelectProps<T>, "className" | "children">,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const field = useSlottedContext(FieldContext);
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;

  return (
    <span data-slot="control" className="block">
      <AriaSelect
        ref={ref}
        {...field}
        {...mergeProps(props, field, {
          onSelectionChange: fieldControl?.onChange,
          onBlur: fieldControl?.onBlur,
          selectedKey: fieldControl?.value,
        })}
        data-adjoined={adjoined}
        placeholder={props.placeholder ?? "Select an option"}
        className={clsx([
          className,
          // Adjoined
          adjoinedStyles({ direction: adjoined }),
          // Basic layout
          "group relative block w-full",
          // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
          "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
          // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
          "dark:before:hidden",
          // Focus ring
          "after:pointer-events-none after:absolute after:inset-0 after:ring-transparent after:ring-inset after:has-[[data-focused]]:ring-2 after:has-[[data-focused]]:ring-blue-500",
          // Disabled state
          "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none",
          // Invalid state
          "before:has-[[data-invalid]]:shadow-red-500/10",
        ])}
      >
        <Button
          id={field?.id}
          data-component="select"
          className={clsx([
            // Basic layout
            "relative block w-full rounded-[var(--radius-control)] py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            // Horizontal padding
            "pr-[calc(theme(spacing.10)-1px)] pl-[calc(theme(spacing[3.5])-1px)] sm:pr-[calc(theme(spacing.9)-1px)] sm:pl-[calc(theme(spacing.3)-1px)]",
            // Typography
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white dark:*:text-white [&_[data-placeholder]]:text-zinc-500",
            // Border
            "border-brand-border border data-[hovered]:border-zinc-950/20 dark:data-[hovered]:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Hide default focus styles
            "focus:outline-none",
            // Invalid state
            "group-data-[invalid]/field:border-red-500 group-data-[invalid]/field:data-[hovered]:border-red-500 group-data-[invalid]/field:dark:border-red-600 group-data-[invalid]/field:hover:dark:border-red-600",
            // Disabled state
            "data-[disabled]:border-zinc-950/20 data-[disabled]:opacity-100 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%] dark:data-[hovered]:data-[disabled]:border-white/15",
          ])}
        >
          <div className="truncate text-left">
            <SelectValue className="whitespace-nowrap" />
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="size-5 stroke-zinc-500 group-has-[[data-disabled]]:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]"
              viewBox="0 0 16 16"
              aria-hidden="true"
              fill="none"
            >
              <path
                d="M5.75 10.75L8 13L10.25 10.75"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10.25 5.25L8 3L5.75 5.25"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </Button>
        <Popover>
          <ListBox
            items={items}
            className={clsx([
              // Base styles
              "sm:max-w-auto isolate max-h-64 w-full max-w-(--trigger-width) min-w-[var(--trigger-width)] scroll-py-1 rounded-[var(--radius-control)] py-1 select-none",
              // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
              "outline outline-transparent focus:outline-none",
              // Handle scrolling when menu won't fit in viewport
              "overflow-y-auto overscroll-contain",
              // Popover background
              "bg-white/95 backdrop-blur-xl dark:bg-zinc-800/75",
              // Shadows
              "shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset",
            ])}
          >
            {children}
          </ListBox>
        </Popover>
      </AriaSelect>
    </span>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _Select = (forwardRef as forwardRefType)(Select);

export { _Select as Select };

export function Option({ className, ...props }: ListBoxItemProps) {
  const sharedClasses = clsx(
    // Base
    "flex min-w-0 items-center",
    // Icons
    "[&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 sm:[&>[data-slot=icon]]:size-4",
    "[&>[data-slot=icon]]:text-zinc-500 [&>[data-slot=icon]]:group-data-[focused]/option:text-white [&>[data-slot=icon]]:dark:text-zinc-400",
    "forced-colors:[&>[data-slot=icon]]:text-[CanvasText] forced-colors:[&>[data-slot=icon]]:group-data-[focused]/option:text-[Canvas]",
    // Avatars
    "[&>[data-slot=avatar]]:-mx-0.5 [&>[data-slot=avatar]]:size-6 sm:[&>[data-slot=avatar]]:size-5",
  );

  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <ListBoxItem
        {...props}
        className={clsx([
          className,
          // Basic layout
          "group/option grid cursor-default grid-cols-[1fr_--spacing(5)] items-baseline gap-x-2 rounded-[calc(var(--radius-control)/2)] px-3.5 py-2.5 sm:grid-cols-[1fr_--spacing(4)] sm:px-3 sm:py-1.5",
          // Typography
          "text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
          // Focus
          "outline-none data-[focused]:bg-zinc-100 data-[focused]:text-zinc-700",
          // Forced colors mode
          "forced-color-adjust-none forced-colors:data-[focused]:bg-[Highlight] forced-colors:data-[focused]:text-[HighlightText]",
          // Disabled
          "data-[disabled]:opacity-50",
        ])}
      >
        {(renderProps) => {
          return (
            <>
              <span
                className={clsx([
                  className,
                  sharedClasses,
                  // Label
                  "[&>[data-slot=label]]:ml-2.5 [&>[data-slot=label]]:truncate sm:[&>[data-slot=label]]:ml-2",
                ])}
              >
                {typeof props.children === "function"
                  ? props.children(renderProps)
                  : props.children}
              </span>
              <svg
                className="relative hidden size-5 self-center stroke-current text-zinc-950 group-data-[selected]/option:inline sm:size-4"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 8.5l3 3L12 4"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          );
        }}
      </ListBoxItem>
    </Provider>
  );
}
