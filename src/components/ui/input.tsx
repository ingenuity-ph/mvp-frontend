import { EyeIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { mergeProps, mergeRefs, useObjectRef } from "@react-aria/utils";
import { forwardRef, useState } from "react";
import {
  Input as AriaInput,
  type InputProps as AriaInputProps,
  SearchField as AriaSearchField,
  type SearchFieldProps as AriaSearchFieldProps,
  TextField as AriaTextField,
} from "react-aria-components";
import type { FieldPath, FieldValues } from "react-hook-form";
import { tv, type VariantProps } from "tailwind-variants";
import { Button } from "./button";
import type { Adjoined } from "./constants";
import {
  Description,
  Field,
  FieldControl,
  Label,
  useFieldController,
  useFieldProps,
  type WithComposedFieldControlProps,
} from "./fieldset";
import { cn, type forwardRefType } from "./utils";

export const inputGroupStyles = tv({
  slots: {
    start: [
      // Base
      "relative flex justify-center items-center pr-1.5 *:text-neutral-500 dark:*:text-neutral-400",
      // Icon
      "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:size-4",
    ],
    end: [
      // Base
      "relative flex justify-center items-center pl-1.5 *:text-neutral-500 dark:*:text-neutral-400",
      // Icon
      "[&>[data-slot=icon]]:pointer-events-none [&>[data-slot=icon]]:z-10 [&>[data-slot=icon]]:size-5 sm:[&>[data-slot=icon]]:size-4",
    ],
  },
});

export const inputStyles = tv({
  slots: {
    root: [
      // Basic layout
      "relative isolate block w-full",
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
      // Focus ring
      "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-control)] after:ring-inset after:ring-transparent sm:has-[[data-focus-visible]]:after:ring-2 sm:has-[[data-focus-visible]]:after:ring-info-500",
      // Disabled state
      "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none",
      // Invalid state
      "before:has-[[data-invalid]]:shadow-danger-500/10",
    ],
  },
  variants: {
    adjoined: {
      none: [],
      top: [
        // Root
        "before:rounded-t-none:after:rounded-t-none",
        // Input
        "*:data-[slot=input-container]:rounded-t-none",
        // Border
        "*:data-[slot=input-container]:border-t-0",
      ],
      right: [
        // Root
        "before:rounded-r-none after:rounded-r-none",
        // Input
        "*:data-[slot=input-container]:rounded-r-none",
        // Border
        "*:data-[slot=input-container]:border-r-0",
      ],
      bottom: [
        // Root
        "before:rounded-b-none after:rounded-b-none",
        // Input
        "*:data-[slot=input-container]:rounded-b-none",
        // Border
        "*:data-[slot=input-container]:border-b-0",
      ],
      left: [
        // Root
        "before:rounded-l-none after:rounded-l-none",
        // Input
        "*:data-[slot=input-container]:rounded-l-none",
        // Border
        "*:data-[slot=input-container]:border-l-0",
      ],
    } satisfies Record<Adjoined, Array<string>>,
  },
  defaultVariants: {
    adjoined: "none",
  },
});

type AdjoinedVariants = VariantProps<typeof inputStyles>;
export const matchMultipleAdjoined = (
  insets: Array<AdjoinedVariants["adjoined"]>
) => {
  return cn(insets.map((v) => (v ? inputStyles.variants.adjoined[v] : "")));
};

type InputProps = Omit<AriaInputProps, "className"> & {
  startEnhancer?: React.ReactNode;
  endEnhancer?: React.ReactNode;
  className?: string;
  clearable?: boolean;
  adjoined?: Array<Adjoined> | Adjoined;
};

const _BaseInput = forwardRef(function BaseInput(
  {
    className,
    startEnhancer,
    endEnhancer,
    clearable = false,
    adjoined,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined ?? "none"];

  const objectRef = useObjectRef(ref);
  const controller = useFieldController();
  const fieldControl = controller?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);

  return (
    <div
      data-slot="input-container"
      className={cn([
        // Basic layout
        "relative flex rounded-[var(--input-radius,--radius-control-verbose)]",
        // Horizontal Padding - moved the horizontal padding here to handle enhancers
        "px-[calc(theme(spacing[3.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)]",
        // Border
        "border-control-border border has-[[data-hovered]]:border-neutral-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
        // Background color
        "bg-transparent dark:bg-white/5",
        // Invalid state
        "group-data-[invalid]/field:border-danger-500 group-data-[invalid]/field:hover:border-danger-500 group-data-[invalid]/field:dark:border-danger-500 group-data-[invalid]/field:hover:dark:border-danger-500",
        // Disabled state
        "disabled:border-neutral-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
        // Adjoined
        adjoinedStyles,
      ])}
    >
      {Boolean(startEnhancer) && (
        <div data-slot="enhancer" className={cn([inputGroupStyles().start()])}>
          {startEnhancer}
        </div>
      )}
      <AriaInput
        ref={mergedRef}
        {...props}
        className={cn([
          className,
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
      />
      {clearable && (
        <ClearButton
          onClick={() => {
            controller?.field.onChange(props.defaultValue ?? "");
          }}
        />
      )}
      {Boolean(endEnhancer) && (
        <span data-slot="enhancer" className={cn(inputGroupStyles().end())}>
          {endEnhancer}
        </span>
      )}
    </div>
  );
});

export const Input = forwardRef(function Input(
  {
    className,
    startEnhancer,
    endEnhancer,
    clearable = false,
    adjoined,
    ...props
  }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const field = useFieldProps();

  const objectRef = useObjectRef(ref);
  const controller = useFieldController();
  const fieldControl = controller?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);

  const { root } = inputStyles();

  return (
    <AriaTextField
      id={field?.id}
      value={fieldControl?.value}
      aria-labelledby={field?.["aria-labelledby"]}
      aria-describedby={field?.["aria-describedby"]}
      isDisabled={field?.isDisabled}
      isInvalid={field?.isInvalid}
      data-slot="control"
      data-adjoined={adjoined}
      className={cn(className, root())}
      onChange={fieldControl?.onChange}
      onBlur={fieldControl?.onBlur}
    >
      <_BaseInput
        ref={mergedRef}
        {...props}
        endEnhancer={endEnhancer}
        startEnhancer={startEnhancer}
        clearable={clearable}
      />
    </AriaTextField>
  );
});

function ClearButton({ onClick }: { onClick?: () => void }) {
  return (
    <Button
      variant="plain"
      size="sm"
      slot="clear"
      inset="right"
      onPress={onClick}
    >
      <XIcon />
    </Button>
  );
}

export function InputField<
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  label,
  description,
  control,
  field,
  disabled,
  defaultFieldValue,
  ...props
}: WithComposedFieldControlProps<InputProps, TControl, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        isDisabled={disabled}
        defaultValue={defaultFieldValue}
      >
        {label ? <Label>{label}</Label> : null}
        <Input {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled}>
      {label ? <Label>{label}</Label> : null}
      <Input disabled={disabled} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

export function _PasswordInput(
  { className, disabled, defaultValue, ...props }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      ref={ref}
      {...props}
      type={isVisible ? "text" : "password"}
      autoComplete="password"
      endEnhancer={
        <Button
          variant="plain"
          data-slot="action"
          inset="right"
          onPress={() => {
            setIsVisible((prev) => !prev);
          }}
        >
          <EyeIcon />
        </Button>
      }
    />
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const PasswordInput = (forwardRef as forwardRefType)(_PasswordInput);

export function PasswordInputField<
  TControl extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TControl> = FieldPath<TControl>,
>({
  className,
  label,
  description,
  control,
  field,
  disabled,
  defaultValue,
  ...props
}: WithComposedFieldControlProps<InputProps, TControl, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl
        control={control}
        field={field}
        isDisabled={disabled}
        defaultValue={defaultValue}
        className={className}
      >
        {label ? <Label>{label}</Label> : null}
        <PasswordInput {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={disabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <PasswordInput {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}

type SearchInputProps = Omit<
  InputProps,
  keyof AriaSearchFieldProps | "clearable"
> &
  AriaSearchFieldProps & {
    adjoined?: Adjoined;
    className?: string;
  };
export const SearchInput = forwardRef(function SearchInput(
  { className, adjoined, placeholder, ...props }: SearchInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  const objectRef = useObjectRef(ref);
  const fieldProps = useFieldProps();
  const controller = useFieldController();
  const fieldController = controller?.field;

  const mergedRef = mergeRefs(objectRef, fieldController?.ref);

  const { root } = inputStyles();

  const adjoinedStyles = Array.isArray(adjoined)
    ? matchMultipleAdjoined(adjoined)
    : inputStyles.variants.adjoined[adjoined ?? "none"];

  return (
    <AriaSearchField
      ref={mergedRef}
      aria-label="Search"
      defaultValue={props.defaultValue?.toString()}
      data-slot="control"
      data-adjoined={adjoined}
      isDisabled={props.disabled}
      className={cn(className, "group", root(), adjoinedStyles)}
      {...mergeProps(props, fieldProps, {
        onChange: fieldController?.onChange,
        onBlur: fieldController?.onBlur,
        onClear: () => {
          if (!fieldController) {
            return;
          }
          fieldController.onChange("");
        },
      })}
    >
      <_BaseInput
        adjoined="right"
        startEnhancer={<MagnifyingGlassIcon />}
        placeholder={placeholder}
        endEnhancer={
          <span className="in-data-empty:opacity-0">
            <ClearButton />
          </span>
        }
      />
    </AriaSearchField>
  );
});

export function SearchField<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  onClear,
  className,
  onChange,
  control,
  label,
  description,
  field,
  placeholder,
  ...props
}: WithComposedFieldControlProps<SearchInputProps, TFieldValues, TFieldName>) {
  if (control && field) {
    return (
      <FieldControl control={control} field={field} className={className}>
        {label ? <Label>{label}</Label> : null}
        <SearchInput placeholder={placeholder} {...props} />
        {description ? <Description>{description}</Description> : null}
      </FieldControl>
    );
  }

  return (
    <Field isDisabled={props.isDisabled} className={className}>
      {label ? <Label>{label}</Label> : null}
      <SearchInput placeholder={placeholder} {...props} />
      {description ? <Description>{description}</Description> : null}
    </Field>
  );
}
