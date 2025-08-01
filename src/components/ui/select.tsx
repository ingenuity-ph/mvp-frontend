import { clsx } from "clsx";
import { forwardRef } from "react";
import { mergeProps } from "react-aria";
import {
  Select as AriaSelect,
  type SelectProps as AriaSelectProps,
  Button,
  ListBox,
  Popover,
  SelectValue,
  useSlottedContext,
} from "react-aria-components";
export { Option } from "./picker";
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
  adjoined?: Adjoined;
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
} & Omit<AriaSelectProps<T>, "className" | "children">;

function Select<T extends object>(
  {
    className,
    children,
    adjoined = "none",
    isDisabled = false,
    items,
    ...props
  }: SelectProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const field = useSlottedContext(FieldContext);
  const resolvedDisabled = isDisabled || field?.isDisabled;

  const fieldControl = useSlottedContext(FieldControllerContext)?.field;

  return (
    <div data-slot="control">
      <AriaSelect
        ref={ref}
        {...field}
        {...mergeProps(props, { isDisabled: resolvedDisabled }, field, {
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
        isDisabled={disabled}
        defaultValue={defaultSelectedKey}
      >
        <Field>
          {label ? <Label>{label}</Label> : null}
          <_Select {...props} defaultSelectedKey={defaultSelectedKey} />
          {description ? <Description>{description}</Description> : null}
        </Field>
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled}>
      {label ? <Label>{label}</Label> : null}
      <_Select {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const _Select = (forwardRef as forwardRefType)(Select);

export { _Select as Select };
