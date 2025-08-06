import { mergeProps, useId } from "@react-aria/utils";
import {
  type ComponentPropsWithoutRef,
  createContext,
  forwardRef,
} from "react";
import { type AriaFieldProps, useField, useObjectRef } from "react-aria";
import {
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  Label as AriaLabel,
  LabelContext as AriaLabelContext,
  type LabelProps as AriaLabelProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
  type ContextValue,
  DEFAULT_SLOT,
  LabelContext,
  Provider,
  TextContext,
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
import { textStyles, type TextVariants } from "./text";
import { cn } from "./utils";

export function Fieldset({
  className,
  ...props
}: { className?: string } & Omit<AriaGroupProps, "className">) {
  const labelId = useId();
  const descriptionId = useId();

  return (
    <Provider
      values={[
        [
          TextContext,
          {
            slots: {
              [DEFAULT_SLOT]: {},
              legend: {
                id: labelId,
                elementType: "span",
              },
              description: {
                id: descriptionId,
                elementType: "p",
              },
            },
          },
        ],
      ]}
    >
      <AriaGroup
        {...props}
        data-slot="fieldset"
        className={cn(
          className,
          "[&>*+[data-slot=control]]:mt-6 [&>[data-slot=description]]:mt-1"
        )}
      />
    </Provider>
  );
}

export function Legend({
  className,
  ...props
}: { className?: string } & Omit<AriaTextProps, "className">) {
  return (
    <AriaText
      data-slot="legend"
      slot="legend"
      {...props}
      className={cn(
        className,
        //
        textStyles({ label: "sm", color: "neutral" }),
        //
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
  ContextValue<
    PublicAriaFieldProps & {
      isDisabled?: boolean;
      isInvalid?: boolean;
    },
    HTMLDivElement
  >
>({});
export const useFieldProps = () => useSlottedContext(FieldContext);

export type FieldProps = Omit<
  ComponentPropsWithoutRef<"div">,
  keyof PublicAriaFieldProps
> &
  PublicAriaFieldProps & { isDisabled?: boolean; isInvalid?: boolean };

/**
 * Type helper when composing `Field`.
 *
 * @example InputField that integrates a `label` and `description`
 */
export interface ComposedFieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
}
export type WithComposedFieldControlProps<
  TBaseProps extends object,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = ComposedFieldProps &
  TBaseProps &
  Partial<
    Pick<
      UseControllerProps<TFieldValues, TName>,
      "control" | "shouldUnregister"
    > & {
      field: TName;
      defaultFieldValue?: UseControllerProps<
        TFieldValues,
        TName
      >["defaultValue"];
    }
  >;
/**
 * Helper to split the props of a `FieldControl` component.
 */
// export function splitComposedFieldControlProps<
//   TFieldValues extends FieldValues,
//   TName extends FieldPath<TFieldValues>,
// >(props: any) {
//   return createSplitProps<
//     WithComposedFieldControlProps<{}, TFieldValues, TName>
//   >()(props, [
//     "control",
//     "field",
//     "defaultFieldValue",
//     "label",
//     "description",
//     "shouldUnregister",
//   ]);
// }

export const HeadlessField = forwardRef<HTMLDivElement, FieldProps>(
  function HeadlessField({ isDisabled, isInvalid, ...props }, ref) {
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
          [LabelContext, { ...field.labelProps, elementType: "label" }],
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
          [
            FieldContext,
            mergeProps(field.fieldProps, { isDisabled, isInvalid }),
          ],
        ]}
      >
        <div
          ref={ref}
          {...props}
          data-disabled={isDisabled ? "" : undefined}
          data-invalid={isInvalid ? "" : undefined}
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
  "[&>[data-slot=description]+[data-slot=control]]:mt-2",
  "[&>[data-slot=control]+[data-slot=description]]:mt-2",
  "[&>[data-slot=control]+[data-slot=error]]:mt-1.5",
  "[&>[data-slot=label]]:font-medium",
];
export function Field({ className, ...props }: FieldProps) {
  return (
    <HeadlessField
      {...props}
      className={cn(className, "group", fieldLayoutStyles)}
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
  children,
  control,
  field,
  unstyled,
  shouldUnregister = false,
  defaultFieldValue,
  ...props
}: FieldProps &
  Pick<UseControllerProps<T, TName>, "control" | "shouldUnregister"> & {
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
    disabled: props.isDisabled,
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
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        className={cn(className, "group/field", !unstyled && fieldLayoutStyles)}
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

export const Label = forwardRef<
  HTMLLabelElement,
  AriaLabelProps &
    Partial<{
      size: TextVariants["label"];
      color: TextVariants["color"];
    }>
>(function Label({ size = "sm", color = "neutral", ...props }, ref) {
  return (
    <HeadlessLabel
      ref={ref}
      {...props}
      data-slot="label"
      className={cn(
        props.className,
        // Base
        "select-none group-data-disabled:opacity-50",
        // Inherit text styles
        textStyles({ color, label: size })
      )}
    />
  );
});

export function Description({ className, ...props }: AriaTextProps) {
  return (
    <AriaText
      data-slot="description"
      slot="description"
      {...props}
      className={cn(
        "block text-brand-neutral group-data-disabled:opacity-50 dark:text-brand-neutral-subtle",
        // Inherit text styles
        textStyles({ color: "none", paragraph: "sm" }),
        //
        className
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
        "inline-block text-base/6 text-danger-600 data-[disabled]:opacity-50 sm:text-sm/6 dark:text-danger-500"
      )}
    />
  );
}
