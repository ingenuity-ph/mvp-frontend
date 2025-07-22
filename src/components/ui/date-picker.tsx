import { type DateValue, mergeProps } from "react-aria";
import {
  DateInput,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateRangePicker as AriaDateRangePicker,
  type DateRangePickerProps as AriaDateRangePickerProps,
  DateSegment,
  Group,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import type { VariantProps } from "tailwind-variants";
import { z } from "zod";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { Calendar, RangeCalendar } from "./calendar";
import {
  type ComposedFieldProps,
  Description,
  ErrorMessage,
  FieldControl,
  fieldLayoutStyles,
  Label,
  useFieldController,
  useFieldProps,
  type WithFieldControlProps,
} from "./fieldset";
import {
  inputGroupStyles,
  inputSlots,
  inputStyles,
  matchMultipleAdjoined,
} from "./input";
import { PopoverDialog } from "./popover";
import { cn } from "./utils";

const parseToDate = (value: unknown) => {
  const isDate = z.coerce.date().safeParse(value);

  if (isDate.success) {
    return parseAbsoluteToLocal(isDate.data.toISOString());
  }
  const isString = z.string().safeParse(value);

  if (isString.success) {
    return parseAbsoluteToLocal(isString.data);
  }

  return undefined;
};

type OwnProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Partial<{
  adjoined: VariantProps<typeof inputStyles>["adjoined"];
}> &
  ComposedFieldProps &
  Partial<WithFieldControlProps<TFieldValues, TName>>;

/**
 * TODO:
 * figure out error message display
 * - should `description` be shown when there is an error?
 */
export function DatePickerField<
  T extends DateValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined,
  label,
  description,
  control,
  field: fieldName,
  className,
  ...props
}: AriaDatePickerProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldControl = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;

  const field = useFieldProps();
  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined ?? "none"];

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName}>
        <DatePickerField
          className={className}
          label={label}
          description={description}
          {...props}
        />
      </FieldControl>
    );
  }

  return (
    <AriaDatePicker
      data-slot="control"
      {...mergeProps(props, {
        ...fieldControl,
        value: parseToDate(fieldControl?.value),
        onChange: (value: DateValue | null) => {
          fieldControl?.onChange(
            value?.toDate(getLocalTimeZone()).toISOString()
          );
        },
      })}
      className={cn([className, fieldLayoutStyles])}
    >
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        label && <Label>{label}</Label>
      }
      <div
        data-slot="control"
        className={cn("group", inputSlots().root(), inputStyles({ adjoined }))}
      >
        <Group
          aria-labelledby={field?.id}
          aria-describedby={field?.["aria-describedby"]}
          className={cn([
            // Basic layout
            "relative flex rounded-[var(--radius-control)]",
            // Horizontal Padding - moved the horizontal padding here to handle enhancers
            "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
            // Border
            "border-control-border border has-[[data-hovered]]:border-neutral-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Invalid state
            "group-data-[invalid]:border-danger-500 group-data-[invalid]:hover:border-danger-500 dark:group-data-[invalid]:border-danger-500 dark:group-data-[invalid]:hover:border-danger-500",
            // Disabled state
            "disabled:border-neutral-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
            // Adjoined
            adjoinedStyles,
          ])}
        >
          <DateInput
            className={cn([
              // Layout
              "block w-full appearance-none bg-transparent",
              // Typography
              "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
              // Hide default focus styles
              "focus-within:outline-none focus:outline-none focus-visible:outline-none",
              // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
              // when the padding is applied on the wrapper the padding does not collapse properly
              "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            ])}
          >
            {(segment) => <DateSegment segment={segment} />}
          </DateInput>
          <span data-slot="enhancer" className={cn(inputGroupStyles().end())}>
            <Button
              data-slot="action"
              size="sm"
              variant="plain"
              inset="right"
              className="self-stretch"
            >
              <CalendarBlankIcon />
            </Button>
          </span>
        </Group>
      </div>
      {description ? <Description>{description}</Description> : null}
      {fieldErrorMessage ? (
        <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
      ) : null}

      <PopoverDialog>
        <Calendar />
      </PopoverDialog>
    </AriaDatePicker>
  );
}

export function DateRangePickerField<
  T extends DateValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined,
  control,
  className,
  label,
  description,
  field: fieldName,
  ...props
}: AriaDateRangePickerProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldControl = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;

  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined ?? "none"];

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName}>
        <DateRangePickerField
          className={className}
          label={label}
          description={description}
          {...props}
        />
      </FieldControl>
    );
  }

  return (
    <AriaDateRangePicker
      data-slot="control"
      granularity="day"
      {...mergeProps(props, {
        ...fieldControl,
        value: parseToDate(fieldControl?.value),
        onChange: (value: DateValue | null) => {
          fieldControl?.onChange(
            value?.toDate(getLocalTimeZone()).toISOString()
          );
        },
      })}
      className={cn([className, fieldLayoutStyles])}
    >
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        label && <Label>{label}</Label>
      }
      <div
        data-slot="control"
        className={cn("group", inputSlots().root(), inputStyles({ adjoined }))}
      >
        <Group
          className={cn([
            // Basic layout
            "relative flex rounded-[var(--radius-control)]",
            // Horizontal Padding - moved the horizontal padding here to handle enhancers
            "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
            // Border
            "border-control-border border has-[[data-hovered]]:border-neutral-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
            // Background color
            "bg-transparent dark:bg-white/5",
            // Invalid state
            "group-data-[invalid]:border-danger-500 group-data-[invalid]:hover:border-danger-500 dark:group-data-[invalid]:border-danger-500 dark:group-data-[invalid]:hover:border-danger-500",
            // Disabled state
            "disabled:border-neutral-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
            // Adjoined
            adjoinedStyles,
          ])}
        >
          <div className="flex flex-1 items-center gap-x-2">
            <DateInput
              slot="start"
              className={cn([
                // Layout
                "block appearance-none bg-transparent",
                // Typography
                "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
                // Hide default focus styles
                "focus-within:outline-none focus:outline-none focus-visible:outline-none",
                // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
                // when the padding is applied on the wrapper the padding does not collapse properly
                "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
              ])}
            >
              {(segment) => <DateSegment segment={segment} />}
            </DateInput>
            <span>-</span>
            <DateInput
              slot="end"
              className={cn([
                // Layout
                "block appearance-none bg-transparent",
                // Typography
                "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
                // Hide default focus styles
                "focus-within:outline-none focus:outline-none focus-visible:outline-none",
                // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
                // when the padding is applied on the wrapper the padding does not collapse properly
                "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
              ])}
            >
              {(segment) => <DateSegment segment={segment} />}
            </DateInput>
          </div>
          <span data-slot="enhancer" className={cn(inputGroupStyles().end())}>
            <Button
              data-slot="action"
              size="sm"
              variant="plain"
              inset="right"
              className="self-stretch"
            >
              <CalendarBlankIcon />
            </Button>
          </span>
        </Group>
      </div>
      {description ? <Description>{description}</Description> : null}
      {fieldErrorMessage ? (
        <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
      ) : null}
      <PopoverDialog>
        <RangeCalendar />
      </PopoverDialog>
    </AriaDateRangePicker>
  );
}
