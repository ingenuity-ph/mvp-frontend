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
import type { FieldPath, FieldValues } from "react-hook-form";
import { tv } from "tailwind-variants";
import type { Adjoined } from "./constants";
import {
  type ComposedFieldProps,
  Description,
  Field,
  FieldContext,
  FieldControl,
  FieldControllerContext,
  Label,
  type WithFieldControlProps,
} from "./fieldset";
import { textStyles } from "./text";
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

export type SelectProps<T extends object> = {
  className?: string;
  disabled?: boolean;
  adjoined?: Adjoined;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
} & Omit<AriaSelectProps<T>, "className" | "children" | "isDisabled">;

function Select<T extends object>(
  {
    className,
    children,
    adjoined = "none",
    disabled = false,
    items,
    ...props
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const field = useSlottedContext(FieldContext);
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;

  return (
    <div data-slot="control">
      <AriaSelect
        ref={ref}
        {...field}
        {...mergeProps(props, { isDisabled: disabled }, field, {
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
          "after:pointer-events-none after:absolute after:inset-0 after:ring-transparent after:ring-inset after:has-[[data-focused]]:ring-2 after:has-[[data-focused]]:ring-info-500",
          // Disabled state
          "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none",
          // Invalid state
          "before:has-[[data-invalid]]:shadow-danger-500/10",
        ])}
      >
        <Button
          id={field?.id}
          data-component="select"
          className={clsx([
            // Basic layout
            "relative block w-full rounded-[var(--radius-control)] py-[calc(theme(spacing[2.5])-1px)]",
            // Horizontal padding
            "pr-[calc(--spacing(9)-1px)] pl-[calc(--spacing(3)-1px)]",
            // Typography
            "text-neutral-950 placeholder:text-neutral-500 dark:text-white dark:*:text-white [&_[data-placeholder]]:text-neutral-500",
            // Inherit text styles
            textStyles({ color: "none", label: "sm" }),
            // Border
            "border-control-border border hover:border-neutral-950/20 dark:hover:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Hide default focus styles
            "focus:outline-none",
            // Invalid state
            "group-data-[invalid]/field:border-danger-500 group-data-[invalid]/field:data-[hovered]:border-danger-500 group-data-[invalid]/field:dark:border-danger-600 group-data-[invalid]/field:hover:dark:border-danger-600",
            // Disabled state
            "data-[disabled]:border-neutral-950/20 data-[disabled]:opacity-100 data-[disabled]:dark:border-white/15 data-[disabled]:dark:bg-white/[2.5%] dark:data-[hovered]:data-[disabled]:border-white/15",
          ])}
        >
          <div className="truncate text-left">
            <SelectValue className="whitespace-nowrap" />
          </div>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <svg
              className="size-5 stroke-neutral-500 group-has-[[data-disabled]]:stroke-neutral-600 sm:size-4 dark:stroke-neutral-400 forced-colors:stroke-[CanvasText]"
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
              // TODO: Fix the max-width calculation to handle the case where the width is too small
              "isolate max-h-64 w-max min-w-[var(--trigger-width)] scroll-py-1 rounded-[var(--radius-control)] py-1 select-none",
              // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
              "outline outline-transparent focus:outline-none",
              // Handle scrolling when menu won't fit in viewport
              "overflow-y-auto overscroll-contain",
              // Popover background
              "bg-white/95 backdrop-blur-xl dark:bg-neutral-800/75",
              // Shadows
              "shadow-lg ring-1 ring-neutral-950/10 dark:ring-white/10 dark:ring-inset",
            ])}
          >
            {children}
          </ListBox>
        </Popover>
      </AriaSelect>
    </div>
  );
}

export function SelectField<
  T extends object,
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  label,
  description,
  control,
  field,
  defaultSelectedKey,
  disabled,
  ...props
}: SelectProps<T> &
  ComposedFieldProps &
  Partial<WithFieldControlProps<TControl, TFieldName>>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        disabled={disabled}
        defaultValue={defaultSelectedKey}
      >
        <Field>
          {label ? <Label>{label}</Label> : null}
          <_Select
            {...props}
            disabled={disabled}
            defaultSelectedKey={defaultSelectedKey}
          />
          {description ? <Description>{description}</Description> : null}
        </Field>
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled}>
      {label ? <Label>{label}</Label> : null}
      <_Select disabled={disabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _Select = (forwardRef as forwardRefType)(Select);

export { _Select as Select };

export function Option({ className, ...props }: ListBoxItemProps) {
  return (
    <Provider values={[[LabelContext, { elementType: "span" }]]}>
      <ListBoxItem
        {...props}
        className={clsx([
          className,
          // Base styles
          "group cursor-default gap-2 focus:outline-hidden px-3 py-2",
          // Text styles
          // TODO: Think about if we want to set the text styles here or we require to explicitly use a <Label> component
          "text-left text-base/6 text-brand-neutral-text sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]",
          // Focus
          "focus:bg-brand-neutral-muted",
          // Disabled state
          "disabled:opacity-50",
          // Forced colors mode
          "forced-color-adjust-none forced-colors:data-focused:bg-[Highlight] forced-colors:data-focused:text-[HighlightText] forced-colors:data-focused:*:data-[slot=icon]:text-[HighlightText]",
          // Icons
          "*:data-[slot=icon]:size-4 &>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:shrink-0",
          "*:data-[slot=icon]:text-neutral-500 data-focus:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-neutral-400 dark:data-focus:*:data-[slot=icon]:text-white",
          // Avatar
          "*:data-[slot=avatar]:mr-2.5 *:data-[slot=avatar]:-ml-1 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:mr-2 sm:*:data-[slot=avatar]:size-5",
          // Label
          "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1",
          // Description
          "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2 [&>[data-slot=description]]:col-span-2",
        ])}
      />
    </Provider>
  );
}
