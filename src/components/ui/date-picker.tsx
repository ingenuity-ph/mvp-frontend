import { type DateValue, mergeProps } from "react-aria";
import {
  DateInput,
  DatePicker as AriaDatePicker,
  type DatePickerProps as AriaDatePickerProps,
  DateSegment,
  Group,
} from "react-aria-components";
import type { VariantProps } from "tailwind-variants";
import { z } from "zod";
import {
  getLocalTimeZone,
  parseAbsoluteToLocal,
} from "@internationalized/date";
import { CalendarBlank } from "@phosphor-icons/react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { useFieldController, useFieldProps } from "./fieldset";
import {
  inputGroupStyles,
  inputSlots,
  inputStyles,
  matchMultipleAdjoined,
} from "./input";
import { Popover } from "./popover";
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

interface ExtraProps {
  adjoined: VariantProps<typeof inputStyles>["adjoined"];
}

export function DatePicker<T extends DateValue>({
  adjoined,
  ...props
}: AriaDatePickerProps<T> & Partial<ExtraProps>) {
  const fieldControl = useFieldController()?.field;
  const field = useFieldProps();
  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined ?? "none"];

  return (
    <AriaDatePicker
      data-slot="control"
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      granularity="day"
      {...mergeProps(props, {
        ...fieldControl,
        value: parseToDate(fieldControl?.value),
        onChange: (value: DateValue | null) => {
          fieldControl?.onChange(
            value?.toDate(getLocalTimeZone()).toISOString(),
          );
        },
      })}
      className={cn(inputSlots().root(), inputStyles({ adjoined }))}
    >
      <Group
        className={cn([
          // Basic layout
          "relative flex rounded-[var(--radius-control)]",
          // Horizontal Padding - moved the horizontal padding here to handle enhancers
          "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
          // Border
          "border-brand-border border has-[[data-hovered]]:border-zinc-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
          // Background color
          "bg-transparent dark:bg-white/5",
          // Invalid state
          "group-data-[invalid]/field:border-red-500 group-data-[invalid]/field:hover:border-red-500 group-data-[invalid]/field:dark:border-red-500 group-data-[invalid]/field:hover:dark:border-red-500",
          // Disabled state
          "disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
          // Adjoined
          adjoinedStyles,
        ])}
      >
        <DateInput
          className={cn([
            // Layout
            "block w-full appearance-none bg-transparent",
            // Typography
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
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
            <CalendarBlank />
          </Button>
        </span>
      </Group>
      <Popover className="[--gutter:--spacing(2)]">
        <Calendar />
      </Popover>
    </AriaDatePicker>
  );
}
