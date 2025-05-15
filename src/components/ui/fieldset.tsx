import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
} from "react";
import { type AriaFieldProps, useField, useObjectRef } from "react-aria";
import {
  type ContextValue,
  DEFAULT_SLOT,
  Label as AriaLabel,
  LabelContext as AriaLabelContext,
  LabelContext,
  type LabelProps as AriaLabelProps,
  Provider,
  Text as AriaText,
  TextContext,
  type TextProps as AriaTextProps,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import {
  type FieldPath,
  type FieldValues,
  useController,
  type UseControllerProps,
  type UseControllerReturn,
} from "react-hook-form";
import { useId } from "@react-aria/utils";
import { textStyles } from "./text";
import { cn } from "./utils";

export function Fieldset({
  className,
  ...props
}: { className?: string } & ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      data-slot="fieldset"
      className={cn(
        className,
        "[&>*+[data-slot=control]]:mt-3 [&>[data-slot=description]]:mt-1 [&>[data-slot=text]]:mt-1"
      )}
    />
  );
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<AriaTextProps, "className">) {
  return (
    <AriaText
      data-slot="legend"
      {...props}
      className={cn(
        className,
        textStyles({ level: "label-sm", colors: "dark" }),
        "font-semibold data-[disabled]:opacity-50"
      )}
    />
  );
}

export function FieldGroup({
  className,
  layout = "stack",
  ...props
}: React.ComponentPropsWithoutRef<"div"> & { layout?: "stack" | "grid" }) {
  return (
    <div
      data-slot="control"
      {...props}
      className={cn(className, [
        // Base
        layout === "stack" && "space-y-4",
        layout === "grid" &&
          "grid gap-4 sm:grid-cols-[repeat(var(--cols,2),minmax(0,1fr))]",
      ])}
    />
  );
}

export type FieldControllerProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = UseControllerReturn<T, TName>;
export const FieldControllerContext = createContext<
  ContextValue<FieldControllerProps, HTMLElement>
>({});
export const useFieldController = () =>
  useSlottedContext(FieldControllerContext);

type PublicAriaFieldProps = Omit<
  AriaFieldProps,
  "label" | "description" | "errorMessage"
>;
export const FieldContext = createContext<
  ContextValue<PublicAriaFieldProps, HTMLDivElement>
>({});
export const useFieldProps = () => useSlottedContext(FieldContext);

export type FieldProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof PublicAriaFieldProps
> &
  PublicAriaFieldProps & { disabled?: boolean; invalid?: boolean };

/**
 * Type helper when composing `Field`.
 *
 * @example InputField that integrates a `label` and `description`
 */
export interface ComposedFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const HeadlessField = forwardRef<HTMLDivElement, FieldProps>(
  function HeadlessField({ disabled, invalid, ...props }, ref) {
    const fieldId = useId(props.id);
    const labelId = useId();
    const descriptionId = useId();
    const errorMessageId = useId();
    const field = useField({
      ...props,
      "aria-labelledby": labelId,
      id: fieldId,
      label: labelId,
      description: descriptionId,
      errorMessage: errorMessageId,
    });

    return (
      <Provider
        values={[
          [LabelContext, field.labelProps],
          [
            TextContext,
            {
              slots: {
                [DEFAULT_SLOT]: {},
                description: field.descriptionProps,
                errorMessage: field.errorMessageProps,
              },
            },
          ],
          [FieldContext, field.fieldProps],
        ]}
      >
        <div
          ref={ref}
          {...props}
          data-disabled={disabled || undefined}
          data-invalid={invalid || undefined}
        />
      </Provider>
    );
  }
);

export const fieldLayoutStyles = [
  // Base layout
  "group/field",
  "[&>[data-slot=label]+[data-slot=control]]:mt-1.5",
  "[&>[data-slot=label]+[data-slot=description]]:mt-0.5",
  "[&>[data-slot=description]+[data-slot=control]]:mt-1.5",
  "[&>[data-slot=control]+[data-slot=description]]:mt-1.5",
  "[&>[data-slot=control]+[data-slot=error]]:mt-1.5",
  "[&>[data-slot=label]]:font-medium",
];
export function Field({ className, disabled, invalid, ...props }: FieldProps) {
  return (
    <HeadlessField
      {...props}
      disabled={disabled}
      invalid={invalid}
      className={cn(className, fieldLayoutStyles)}
    />
  );
}

export type WithFieldControlProps<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
> = Pick<
  UseControllerProps<T, TName>,
  "control" | "defaultValue" | "disabled"
> & { field: TName };
/**
 * Component to integrate forms with React Hook Form.
 */
export function FieldControl<
  T extends FieldValues = FieldValues,
  TName extends FieldPath<T> = FieldPath<T>,
>({
  className,
  disabled,
  children,
  control,
  field,
  unstyled,
  shouldUnregister = false,
  defaultFieldValue,
  ...props
}: FieldProps &
  Pick<
    UseControllerProps<T, TName>,
    "control" | "disabled" | "shouldUnregister"
  > & {
    field: TName;
    defaultFieldValue?: UseControllerProps<T, TName>["defaultValue"];
    /**
     * Experimental.
     */
    unstyled?: boolean;
  }) {
  const controller = useController<T, TName>({
    control,
    name: field,
    disabled,
    shouldUnregister,
    defaultValue: defaultFieldValue,
  });
  const isInvalid = controller.fieldState.invalid;
  const isDisabled = controller.field.disabled;
  const errorMessage = controller.fieldState.error?.message;

  return (
    <Provider
      values={[
        [
          FieldControllerContext,
          controller as UseControllerReturn<FieldValues, string>,
        ],
      ]}
    >
      <HeadlessField
        {...props}
        disabled={isDisabled}
        invalid={isInvalid}
        className={cn(
          className,
          "group/field",
          !unstyled && [
            "[&>[data-slot=label]+[data-slot=control]]:mt-1.5",
            "[&>[data-slot=label]+[data-slot=description]]:mt-0.5",
            "[&>[data-slot=description]+[data-slot=control]]:mt-1.5",
            "[&>[data-slot=control]+[data-slot=description]]:mt-1.5",
            "[&>[data-slot=control]+[data-slot=error]]:mt-1.5",
            "[&>[data-slot=label]]:font-medium",
          ]
        )}
      >
        {children}
        {isInvalid && <ErrorMessage>{errorMessage}</ErrorMessage>}
      </HeadlessField>
    </Provider>
  );
}

export const HeadlessLabel = forwardRef<HTMLLabelElement, AriaLabelProps>(
  function HeadlessLabel(props, ref) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const _ref = useObjectRef(ref);

    // eslint-disable-next-line no-param-reassign, no-useless-assignment
    [props, ref] = useContextProps(props, _ref, AriaLabelContext);

    return (
      <AriaLabel
        {...props}
        elementType={props.elementType ?? "span"}
        data-slot="label"
      />
    );
  }
);

export const Label = forwardRef<HTMLLabelElement, AriaLabelProps>(
  function Label(props, ref) {
    return (
      <HeadlessLabel
        ref={ref}
        {...props}
        data-slot="label"
        className={cn(
          props.className,
          "text-base/6 text-zinc-950 select-none data-[disabled]:opacity-50 sm:text-sm/6 dark:text-white"
        )}
      />
    );
  }
);

export function Description({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      data-slot="description"
      slot="description"
      {...props}
      className={cn(
        className,
        "block text-base/6 text-zinc-500 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-zinc-400"
      )}
    />
  );
}

export function ErrorMessage({
  className,
  ...props
}: { className?: string } & Omit<AriaTextProps, "className">) {
  return (
    <AriaText
      data-slot="error"
      elementType="p"
      {...props}
      className={cn(
        className,
        "inline-block text-base/6 text-red-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-red-500"
      )}
    />
  );
}
