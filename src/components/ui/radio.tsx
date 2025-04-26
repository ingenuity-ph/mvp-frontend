import { clsx } from "clsx";
import { type ForwardedRef, forwardRef, useContext } from "react";
import { useFocusRing, useHover, useRadio, VisuallyHidden } from "react-aria";
import {
  Radio as AriaRadio,
  RadioContext as AriaRadioContext,
  RadioGroup as AriaRadioGroup,
  type RadioGroupProps as AriaRadioGroupProps,
  RadioGroupStateContext as AriaRadioGroupStateContext,
  type RadioProps as AriaRadioProps,
  useContextProps,
  useSlottedContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { z } from "zod";
import {
  filterDOMProps,
  mergeProps,
  mergeRefs,
  useObjectRef,
} from "@react-aria/utils";
import type { ColorMap, ThemeColors } from "./constants";
import {
  Description,
  FieldContext,
  FieldControllerContext,
  type FieldProps,
  HeadlessField,
  Label,
} from "./fieldset";
import { removeDataAttributes } from "./utils";

export const radio = tv({
  slots: {
    group: [
      // Basic groups
      "space-y-3 [&_[data-slot=label]]:font-normal",
      // With descriptions
      "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
    ],
    field: [
      // Base layout
      "grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]",
      // Control layout
      "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
      // Label layout
      "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
      // Description layout
      "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
      // With description
      "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
    ],
  },
});

/**
 * Https://github.com/colinhacks/zod/issues/2985.
 */
const isBoolean = (maybeBoolean: unknown): maybeBoolean is boolean => {
  return z
    .literal("true")
    .or(z.literal("false"))
    .or(z.literal("0"))
    .or(z.literal("1"))
    .safeParse(maybeBoolean).success;
};

const toBooleanPrimitive = (maybeBoolean: unknown) => {
  return z
    .string()
    .transform((v) => ["true", "1"].includes(v.toLowerCase()))
    .parse(maybeBoolean);
};

export const RadioGroup = forwardRef<
  HTMLDivElement,
  {
    className?: string;
    /**
     * EXPERIMENTAL: Will probably change throughout development to see what works.
     */
    unstyled?: boolean;
  } & Omit<AriaRadioGroupProps, "className">
>(function RadioGroup({ className, unstyled, ...props }, ref) {
  // Get controller to control field value via RHF
  const controller = useSlottedContext(FieldControllerContext)?.field;
  const mergedRef = mergeRefs(controller?.ref, ref);

  return (
    <AriaRadioGroup
      data-slot="control"
      name={controller?.name}
      {...props}
      ref={mergedRef}
      {...mergeProps(props, {
        onChange: (value: unknown) => {
          controller?.onChange(
            isBoolean(value) ? toBooleanPrimitive(value) : value,
          );
        },
        onBlur: controller?.onBlur,
        value: z.coerce
          .string()
          .optional()
          .catch(undefined)
          .parse(controller?.value),
        isDisabled: controller?.disabled,
      })}
      className={clsx(
        className,
        !unstyled && [
          // Basic groups
          "space-y-3 [&_[data-slot=label]]:font-normal",
          // With descriptions
          "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
        ],
      )}
    />
  );
});

export const radioFieldLayoutStyles = [
  // Base layout
  "grid grid-cols-[1.125rem_1fr] items-center gap-x-4 gap-y-1 sm:grid-cols-[1rem_1fr]",
  // Control layout
  "[&>[data-slot=control]]:col-start-1 [&>[data-slot=control]]:row-start-1 [&>[data-slot=control]]:justify-self-center",
  // Label layout
  "[&>[data-slot=label]]:col-start-2 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
  // Description layout
  "[&>[data-slot=description]]:col-start-2 [&>[data-slot=description]]:row-start-2",
  // With description
  "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
];

export function RadioLayout({
  className,
  ...props
}: { className?: string } & Omit<FieldProps, "className">) {
  return (
    <HeadlessField
      data-slot="field"
      {...props}
      className={clsx(className, radioFieldLayoutStyles)}
    />
  );
}

export function RadioField({
  className,
  label,
  description,
  value,
  ...props
}: {
  className?: string;
  value: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
} & Omit<FieldProps, "children" | "className">) {
  return (
    <RadioLayout {...props}>
      <Radio value={value} className={className} />
      {label ? <Label>{label}</Label> : null}
      {description ? <Description>{description}</Description> : null}
    </RadioLayout>
  );
}

const base = [
  // Basic layout
  "relative isolate flex size-[1.1875rem] shrink-0 rounded-full sm:size-[1.0625rem]",
  // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
  "before:absolute before:inset-0 before:-z-10 before:rounded-full before:bg-white before:shadow",
  // Background color when checked
  "before:group-data-[selected]:bg-[--radio-checked-bg]",
  // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
  "dark:before:hidden",
  // Background color applied to control in dark mode
  "dark:bg-white/5 dark:group-data-[selected]:bg-[--radio-checked-bg]",
  // Border
  "border border-zinc-950/15 group-data-[selected]:border-transparent group-data-[selected]:group-data-[hovered]:border-transparent group-data-[hovered]:border-zinc-950/30 group-data-[selected]:bg-[--radio-checked-border]",
  "dark:border-white/15 dark:group-data-[selected]:border-white/5 dark:group-data-[selected]:group-data-[hovered]:border-white/5 dark:group-data-[hovered]:border-white/30",
  // Inner highlight shadow
  "after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_theme(colors.white/15%)]",
  "dark:after:-inset-px dark:after:hidden dark:after:rounded-full dark:group-data-[selected]:after:block",
  // Indicator color (light mode)
  "[--radio-indicator:transparent] group-data-[selected]:[--radio-indicator:var(--radio-checked-indicator)] group-data-[selected]:group-data-[hovered]:[--radio-indicator:var(--radio-checked-indicator)] group-data-[hovered]:[--radio-indicator:theme(colors.zinc.900/10%)]",
  // Indicator color (dark mode)
  "dark:group-data-[selected]:group-data-[hovered]:[--radio-indicator:var(--radio-checked-indicator)] dark:group-data-[hovered]:[--radio-indicator:theme(colors.zinc.700)]",
  // Focus ring
  "group-data-[focused]:outline group-data-[focused]:outline-2 group-data-[focused]:outline-offset-2 group-data-[focused]:outline-blue-500",
  // Disabled state
  "group-data-[disabled]:opacity-50",
  "group-data-[disabled]:border-zinc-950/25 group-data-[disabled]:bg-zinc-950/5 group-data-[disabled]:[--radio-checked-indicator:theme(colors.zinc.950/50%)] group-data-[disabled]:before:bg-transparent",
  "dark:group-data-[disabled]:border-white/20 dark:group-data-[disabled]:bg-white/[2.5%] dark:group-data-[disabled]:[--radio-checked-indicator:theme(colors.white/50%)] dark:group-data-[disabled]:group-data-[selected]:after:hidden",
];

const colors = {
  primary: [
    "[--radio-checked-bg:theme(colors.brand.secondary.600)] [--radio-checked-border:theme(colors.brand.secondary.800/90%)] [--radio-checked-indicator:theme(colors.white)]",
    "dark:[--radio-checked-bg:theme(colors.brand.secondary.600)]",
  ],
  secondary: [
    "[--radio-checked-bg:theme(colors.brand.secondary.600)] [--radio-checked-border:theme(colors.brand.secondary.800/90%)] [--radio-checked-indicator:theme(colors.white)]",
    "dark:[--radio-checked-bg:theme(colors.brand.secondary.600)]",
  ],
  dark: [
    "[--radio-checked-bg:theme(colors.zinc.900)] [--radio-checked-border:theme(colors.zinc.950/90%)] [--radio-checked-indicator:theme(colors.white)]",
    "dark:[--radio-checked-bg:theme(colors.zinc.600)]",
  ],
  light: [
    "[--radio-checked-bg:theme(colors.zinc.900)] [--radio-checked-border:theme(colors.zinc.950/90%)] [--radio-checked-indicator:theme(colors.white)]",
    "dark:[--radio-checked-bg:theme(colors.white)] dark:[--radio-checked-border:theme(colors.zinc.950/15%)] dark:[--radio-checked-indicator:theme(colors.zinc.900)]",
  ],
  neutral:
    "[--radio-checked-indicator:theme(colors.white)] [--radio-checked-bg:theme(colors.zinc.600)] [--radio-checked-border:theme(colors.zinc.700/90%)]",
  danger:
    "[--radio-checked-indicator:theme(colors.white)] [--radio-checked-bg:theme(colors.red.600)] [--radio-checked-border:theme(colors.red.700/90%)]",
  warning:
    "[--radio-checked-bg:theme(colors.yellow.300)] [--radio-checked-border:theme(colors.yellow.400/80%)] [--radio-checked-indicator:theme(colors.yellow.950)]",
  success:
    "[--radio-checked-indicator:theme(colors.white)] [--radio-checked-bg:theme(colors.green.600)] [--radio-checked-border:theme(colors.green.700/90%)]",
  info: "[--radio-checked-indicator:theme(colors.white)] [--radio-checked-bg:theme(colors.sky.500)] [--radio-checked-border:theme(colors.sky.600/80%)]",
} as ColorMap;

type Color = ThemeColors;

export function RadioMark({
  color = "secondary",
}: {
  color?: Color;
  className?: string;
}) {
  return (
    <span className={clsx([base, colors[color]])}>
      <span
        className={clsx(
          "size-full rounded-full border-[4.5px] border-transparent bg-[--radio-indicator] bg-clip-padding",
          // Forced colors mode
          "forced-colors:border-[Canvas] forced-colors:group-data-[selected]:border-[Highlight]",
        )}
      />
    </span>
  );
}

/**
 * We are creating a own implementation of Radio that is RAC compliant.
 * So we do not have to create invalid html markup(double `labels`).
 */
export const Radio = forwardRef(function Radio(
  props: AriaRadioProps & { color?: Color },
  ref: ForwardedRef<HTMLLabelElement>,
) {
  const { color = "neutral", ...racProps } = props;
  const { inputRef: userProvidedInputRef = null } = props;

  // Merge the local props and ref with the ones provided via context.
  // eslint-disable-next-line no-param-reassign, no-useless-assignment
  [props, ref] = useContextProps(racProps, ref, AriaRadioContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);

  const inputRef = useObjectRef(
    mergeRefs(
      userProvidedInputRef,
      // eslint-disable-next-line no-negated-condition, @typescript-eslint/prefer-nullish-coalescing
      props.inputRef !== undefined ? props.inputRef : null,
    ),
  );
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const groupState = useContext(AriaRadioGroupStateContext)!;

  const { labelProps, inputProps, isSelected, isDisabled, isPressed } =
    useRadio(
      {
        ...field,
        ...removeDataAttributes<AriaRadioProps>(props),
        // ReactNode type doesn't allow function children.
        // eslint-disable-next-line unicorn/consistent-destructuring
        children: typeof props.children === "function" ? true : props.children,
      },
      groupState,
      inputRef,
    );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = isDisabled || groupState.isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const DOMProps = filterDOMProps(props);

  // eslint-disable-next-line no-restricted-syntax/noDeleteOperator
  delete DOMProps.id;

  return (
    <div
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      // eslint-disable-next-line unicorn/consistent-destructuring
      slot={props.slot || undefined}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={groupState.isReadOnly || undefined}
      data-invalid={groupState.isInvalid || undefined}
      data-required={groupState.isRequired || undefined}
      role="checkbox"
      aria-checked={isSelected || undefined}
      tabIndex={0}
      data-rac=""
      className={clsx(
        // eslint-disable-next-line unicorn/consistent-destructuring
        props.className,
        "group relative inline-flex focus:outline-none",
      )}
    >
      <RadioMark color={color} />
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
});
export function RadioOverlay(props: AriaRadioProps) {
  return (
    <AriaRadio
      {...props}
      // eslint-disable-next-line react/destructuring-assignment
      className={clsx(props.className, "group focus:outline-none")}
    />
  );
}
