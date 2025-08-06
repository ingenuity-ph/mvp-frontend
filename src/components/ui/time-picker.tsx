import { mergeProps } from "react-aria";
import {
  DateInput as AriaDateInput,
  DateSegment as AriaDateSegment,
  TimeField as AriaTimeField,
  type TimeFieldProps as AriaTimeFieldProps,
  type TimeValue,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import type { VariantProps } from "tailwind-variants";
import { z } from "zod";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { ClockIcon } from "@phosphor-icons/react";
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
import { inputGroupStyles, inputStyles, matchMultipleAdjoined } from "./input";
import { cn, Group } from "./utils";

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

export function TimePickerField<
  T extends TimeValue,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  adjoined = "none",
  label,
  description,
  control,
  field: fieldName,
  className,
  ...props
}: AriaTimeFieldProps<T> & OwnProps<TFieldValues, TName>) {
  const controller = useFieldController();
  const fieldController = controller?.field;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const fieldErrorMessage = controller?.fieldState?.error?.message;

  const field = useFieldProps();
  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined];

  if (control && fieldName) {
    return (
      <FieldControl control={control} field={fieldName}>
        <TimePickerField
          className={className}
          label={label}
          description={description}
          {...props}
        />
      </FieldControl>
    );
  }

  return (
    <AriaTimeField
      {...props}
      data-slot="control"
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      {...mergeProps(props, {
        ...fieldController,
        value: parseToDate(fieldController?.value),
        onChange: (value: TimeValue | null) => {
          fieldController?.onChange(value?.toString());
        },
      })}
      className={cn([className, fieldLayoutStyles, "relative block isolate"])}
    >
      {
        // eslint-disable-next-line @eslint-react/no-leaked-conditional-rendering
        label && <Label>{label}</Label>
      }
      <div
        data-slot="control"
        className={cn("group", inputStyles().root(), inputStyles({ adjoined }))}
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
          <AriaDateInput
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
            {(segment) => <AriaDateSegment segment={segment} />}
          </AriaDateInput>
          <span data-slot="enhancer" className={cn(inputGroupStyles().end())}>
            <ClockIcon />
          </span>
        </Group>
        {description ? <Description>{description}</Description> : null}
        {fieldErrorMessage ? (
          <ErrorMessage>{fieldErrorMessage}</ErrorMessage>
        ) : null}
      </div>
    </AriaTimeField>
  );
}
