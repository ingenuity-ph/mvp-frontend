/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-useless-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-negated-condition */
/* eslint-disable unicorn/consistent-destructuring */
import { clsx } from "clsx";
import {
  type ComponentPropsWithoutRef,
  type ForwardedRef,
  forwardRef,
  useContext,
  useState,
} from "react";
import {
  mergeProps,
  useCheckbox,
  useCheckboxGroupItem,
  useFocusRing,
  useHover,
  useLabel,
  VisuallyHidden,
} from "react-aria";
import {
  CheckboxContext as AriaCheckboxContext,
  CheckboxGroup as AriaCheckboxGroup,
  type CheckboxGroupProps as AriaCheckboxGroupProps,
  CheckboxGroupStateContext,
  type CheckboxProps as AriaCheckboxProps,
  DEFAULT_SLOT,
  LabelContext as AriaLabelContext,
  TextContext as AriaTextContext,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import { useToggleState } from "react-stately";
import {
  filterDOMProps,
  mergeRefs,
  useObjectRef,
  useSlotId,
} from "@react-aria/utils";
import type { ColorMap, ThemeColors } from "./constants";
import {
  Description,
  FieldContext,
  FieldControllerContext,
  Label,
} from "./fieldset";
import { useSlot } from "./utils";

export function CheckboxGroup({ className, ...props }: AriaCheckboxGroupProps) {
  return (
    <AriaCheckboxGroup
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        "space-y-3",
        // With descriptions
        "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
      )}
    />
  );
}

export const checkboxLayoutStyles = [
  // Base layout
  "grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr] relative",
  // Control layout
  "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
  // Label layout
  "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
  // Description layout
  "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
  // With description
  "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
];

type FieldProps = Omit<AriaCheckboxProps, "isDisabled" | "isIndeterminate"> & {
  disabled?: boolean;
  indeterminate?: boolean;
};

export function HeadlessCheckboxField({
  children,
  disabled,
  indeterminate,
  className,
  ...props
}: FieldProps) {
  const [isSelected, setIsSelected] = useState(props.defaultSelected);

  const [labelRef, label] = useSlot();
  const fieldLabel = useLabel({ label });
  const descriptionId = useSlotId();
  const { labelProps } = fieldLabel;

  let { fieldProps } = fieldLabel;

  fieldProps = mergeProps(fieldProps, {
    "aria-describedby":
      [descriptionId, props["aria-describedby"]].filter(Boolean).join(" ") ||
      undefined,
  });

  return (
    <AriaLabelContext.Provider
      value={{
        ...labelProps,
        ref: labelRef,
        ...(disabled ? { "data-disabled": true } : {}),
      }}
    >
      <AriaCheckboxContext.Provider
        value={{
          ...mergeProps(props, fieldProps),
          onChange: setIsSelected,
          isSelected,
          isDisabled: disabled,
          isIndeterminate: indeterminate,
        }}
      >
        <AriaTextContext.Provider
          value={{
            slots: {
              [DEFAULT_SLOT]: {},
              description: {
                id: descriptionId,
                ...(disabled ? { "data-disabled": true } : {}),
              },
            },
          }}
        >
          <div
            data-slot="field"
            {...(disabled ? { "data-disabled": true } : {})}
            className={String(className)}
          >
            {typeof children !== "function" ? children : null}
          </div>
        </AriaTextContext.Provider>
      </AriaCheckboxContext.Provider>
    </AriaLabelContext.Provider>
  );
}

export function CheckboxField(
  props: Omit<FieldProps, "children"> & {
    label?: React.ReactNode;
    description?: React.ReactNode;
  },
) {
  const { disabled, label, description, className } = props;

  return (
    <HeadlessCheckboxField
      {...props}
      disabled={disabled}
      className={clsx(className, checkboxLayoutStyles)}
    >
      <Checkbox />
      {label ? <Label>{label}</Label> : null}
      {description ? <Description>{description}</Description> : null}
    </HeadlessCheckboxField>
  );
}

const base = [
  // Basic layout
  "relative isolate flex size-[1.125rem] items-center justify-center rounded-[0.3125rem] sm:size-4",
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  "before:absolute before:inset-0 before:-z-10 before:rounded-[calc(0.3125rem-1px)] before:bg-white before:shadow",
  // Background color when checked
  "group-data-selected:before:bg-(--checkbox-checked-bg)",
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  "dark:before:hidden",
  // Background color applied to control in dark mode
  "dark:bg-white/5 dark:group-data-selected:bg-(--checkbox-checked-bg)",
  // Border
  "border border-zinc-950/15 group-data-[selected]:border-transparent group-data-[selected]:group-data-[hovered]:border-transparent group-data-[hovered]:border-zinc-950/30 group-data-[selected]:bg-(--checkbox-checked-border)",
  "dark:border-white/15 dark:group-data-[selected]:border-white/5 dark:group-data-[selected]:group-data-[hovered]:border-white/5 dark:group-data-[hovered]:border-white/30",
  // Inner highlight shadow
  "after:absolute after:inset-0 after:rounded-[calc(0.3125rem-1px)] after:shadow-[inset_0_1px_theme(colors.white/15%)]",
  "dark:after:-inset-px dark:after:hidden dark:after:rounded-[0.3125rem] dark:group-data-[selected]:after:block",
  // Focus ring
  "group-data-[focused]:outline group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-blue-500",
  // Disabled state
  "group-data-[disabled]:opacity-50",
  "group-data-[disabled]:border-zinc-950/25 group-data-[disabled]:bg-zinc-950/5 group-data-[disabled]:[--checkbox-check:theme(colors.zinc.950/50%)] group-data-[disabled]:before:bg-transparent",
  "dark:group-data-[disabled]:border-white/20 dark:group-data-[disabled]:bg-white/[2.5%] dark:group-data-[disabled]:[--checkbox-check:theme(colors.white/50%)] dark:group-data-[disabled]:group-data-[selected]:after:hidden",
  // Forced colors mode
  "forced-colors:[--checkbox-check:HighlightText] forced-colors:[--checkbox-checked-bg:Highlight] forced-colors:group-data-[disabled]:[--checkbox-check:Highlight]",
  "dark:forced-colors:[--checkbox-check:HighlightText] dark:forced-colors:[--checkbox-checked-bg:Highlight] dark:forced-colors:group-data-[disabled]:[--checkbox-check:Highlight]",
];

const colors = {
  primary: "",
  secondary: "",
  light:
    "[--checkbox-check:theme(colors.zinc.900)] [--checkbox-checked-bg:theme(colors.white)] [--checkbox-checked-border:theme(colors.zinc.950/15%)]",
  dark: [
    "[--checkbox-check:theme(colors.white)] [--checkbox-checked-bg:theme(colors.zinc.900)] [--checkbox-checked-border:theme(colors.zinc.950/90%)]",
    "dark:[--checkbox-checked-bg:theme(colors.zinc.600)]",
  ],
  neutral:
    "[--checkbox-check:theme(colors.white)] [--checkbox-checked-bg:theme(colors.zinc.600)] [--checkbox-checked-border:theme(colors.zinc.700/90%)]",
  danger:
    "[--checkbox-check:theme(colors.white)] [--checkbox-checked-bg:theme(colors.red.600)] [--checkbox-checked-border:theme(colors.red.700/90%)]",
  warning:
    "[--checkbox-check:theme(colors.yellow.950)] [--checkbox-checked-bg:theme(colors.yellow.300)] [--checkbox-checked-border:theme(colors.yellow.400/80%)]",
  success:
    "[--checkbox-check:theme(colors.white)] [--checkbox-checked-bg:theme(colors.green.600)] [--checkbox-checked-border:theme(colors.green.700/90%)]",
  info: "[--checkbox-check:theme(colors.white)] [--checkbox-checked-bg:theme(colors.sky.500)] [--checkbox-checked-border:theme(colors.sky.600/80%)]",
} as ColorMap;

type Color = ThemeColors;

export function CheckboxMark({
  color,
  ...props
}: ComponentPropsWithoutRef<"span"> & { color: Color }) {
  return (
    <span {...props} className={clsx([props.className, base, colors[color]])}>
      <svg
        className="size-4 stroke-(--checkbox-check) opacity-0 group-data-selected:opacity-100 sm:h-3.5 sm:w-3.5"
        viewBox="0 0 14 14"
        fill="none"
      >
        {/* Checkmark icon */}
        <path
          className="opacity-100 group-data-[indeterminate]:opacity-0"
          d="M3 8L6 11L11 3.5"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Indeterminate icon */}
        <path
          className="opacity-0 group-data-[indeterminate]:opacity-100"
          d="M3 7H11"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * We are creating a own implementation of Checkbox that is RAC compliant.
 * So we do not have to create invalid html markup(double `labels`).
 */
export const Checkbox = forwardRef(function Checkbox(
  props: AriaCheckboxProps & { color?: Color },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { color = "neutral", ...racProps } = props;
  const { inputRef: userProvidedInputRef = null } = props;

  // Merge the local props and ref with the ones provided via context.
  [props, ref] = useContextProps(racProps, ref, AriaCheckboxContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;

  const inputRef = useObjectRef(
    mergeRefs(userProvidedInputRef, props.inputRef ?? null),
  );
  const groupState = useContext(CheckboxGroupStateContext);

  const {
    inputProps,
    labelProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
    isInvalid,
  } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...field,
          ...mergeProps(props, {
            onChange: fieldControl?.onChange,
            onBlur: fieldControl?.onBlur,
            isSelected: fieldControl?.value,
            name: fieldControl?.name,
          }),

          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: props.value,
          // ReactNode type doesn't allow function children.
          children:
            typeof props.children === "function" ? true : props.children,
        },
        groupState,
        inputRef,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(
        {
          ...mergeProps(props, {
            onChange: fieldControl?.onChange,
            onBlur: fieldControl?.onBlur,
            isSelected: fieldControl?.value,
            name: fieldControl?.name,
          }),
          children:
            typeof props.children === "function" ? true : props.children,
        },
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useToggleState(props),
        inputRef,
      );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = isDisabled || isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || props.isIndeterminate || undefined}
      data-indeterminate={props.isIndeterminate || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-invalid={isInvalid || undefined}
      data-required={props.isRequired || undefined}
      role="checkbox"
      aria-checked={isSelected || undefined}
      tabIndex={0}
      data-rac=""
      className={clsx(
        props.className,
        "group relative inline-flex focus:outline-none",
      )}
    >
      <CheckboxMark color={color} />
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
});

export const CheckboxOverlay = forwardRef(function CheckboxOverlay(
  props: AriaCheckboxProps,
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { inputRef: userProvidedInputRef = null } = props;

  // Merge the local props and ref with the ones provided via context.
  [props, ref] = useContextProps(props, ref, AriaCheckboxContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const controller = useSlottedContext(FieldControllerContext);

  const inputRef = useObjectRef(
    mergeRefs(userProvidedInputRef, props.inputRef ?? null),
  );
  const groupState = useContext(CheckboxGroupStateContext);

  const {
    inputProps,
    labelProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
    isInvalid,
  } = groupState
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckboxGroupItem(
        {
          ...field,
          onChange: controller?.field.onChange,
          onBlur: controller?.field.onBlur,
          isSelected: controller?.field.value,
          name: controller?.field.name,
          ...props,
          // Value is optional for standalone checkboxes, but required for CheckboxGroup items;
          // it's passed explicitly here to avoid typescript error (requires ignore).
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          value: props.value,
          // ReactNode type doesn't allow function children.
          children:
            typeof props.children === "function" ? true : props.children,
        },
        groupState,
        inputRef,
      )
    : // eslint-disable-next-line react-hooks/rules-of-hooks
      useCheckbox(
        {
          ...props,
          onChange: controller?.field.onChange,
          onBlur: controller?.field.onBlur,
          isSelected: controller?.field.value,
          name: controller?.field.name,
          children:
            typeof props.children === "function" ? true : props.children,
        },
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useToggleState(
          mergeProps(
            props,
            controller?.field
              ? ({
                  onChange: controller.field.onChange,
                  isSelected: controller.field.value,
                } satisfies AriaCheckboxProps)
              : Object.freeze({}),
          ),
        ),
        inputRef,
      );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = isDisabled || isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || undefined}
      data-indeterminate={props.isIndeterminate || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-invalid={isInvalid || undefined}
      data-required={props.isRequired || undefined}
      aria-checked={isSelected || undefined}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      className={clsx(props.className, "group outline-none")}
    >
      <span className="absolute inset-0">
        <input
          ref={inputRef}
          {...mergeProps(inputProps, focusProps)}
          className="absolute inset-0 m-0 size-full cursor-pointer opacity-0"
        />
      </span>
      {typeof props.children !== "function" && props.children}
    </div>
  );
});
