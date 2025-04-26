import {
  filterDOMProps,
  mergeProps,
  mergeRefs,
  useObjectRef,
} from "@react-aria/utils";
import { clsx } from "clsx";
import type React from "react";
import { createContext, type ForwardedRef, forwardRef } from "react";
import {
  useContextProps,
  useSlottedContext,
  type SwitchProps as AriaSwitchProps,
  type ContextValue,
} from "react-aria-components";
import {
  Description,
  FieldContext,
  FieldControllerContext,
  type FieldProps,
  HeadlessField,
  Label,
} from "./fieldset";
import { useToggleState } from "react-stately";
import { useFocusRing, useHover, useSwitch, VisuallyHidden } from "react-aria";
import { removeDataAttributes } from "./utils";
import type { ThemeColors, VariantConfigMap } from "./constants";

export function SwitchGroup({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="control"
      {...props}
      className={clsx(
        className,
        // Basic groups
        "space-y-3 [&_[data-slot=label]]:font-normal",
        // With descriptions
        "has-[[data-slot=description]]:space-y-6 [&_[data-slot=label]]:has-[[data-slot=description]]:font-medium"
      )}
    />
  );
}

export const switchFieldLayoutStyles = [
  // Base layout
  "grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-1 sm:grid-cols-[1fr_auto]",
  // Control layout
  "[&>[data-slot=control]]:col-start-2 [&>[data-slot=control]]:self-center",
  // Label layout
  "[&>[data-slot=label]]:col-start-1 [&>[data-slot=label]]:row-start-1 [&>[data-slot=label]]:justify-self-start",
  // Description layout
  "[&>[data-slot=description]]:col-start-1 [&>[data-slot=description]]:row-start-2",
  // With description
  "[&_[data-slot=label]]:has-[[data-slot=description]]:font-medium",
];

export function SwitchLayout({
  className,
  ...props
}: { className?: string } & FieldProps) {
  return (
    <HeadlessField
      data-slot="field"
      {...props}
      className={clsx(className, switchFieldLayoutStyles)}
    />
  );
}

export function SwitchField({
  className,
  label,
  description,
  ...props
}: {
  className?: string;
  label?: React.ReactNode;
  description?: React.ReactNode;
} & Omit<FieldProps, "children">) {
  return (
    <SwitchLayout {...props}>
      <Switch />
      {label && <Label>{label}</Label>}
      {description && <Description>{description}</Description>}
    </SwitchLayout>
  );
}

const colors = {
  primary: [
    "[--switch-bg-ring:theme(colors.brand.primary.600/90%)] [--switch-bg:theme(colors.brand.primary.600)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:theme(colors.brand.primary.600)]",
    "[--switch-ring:theme(colors.brand.primary.600/90%)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.primary.700/90%)]",
  ],
  secondary: [
    "[--switch-bg-ring:theme(colors.brand.secondary.600/90%)] [--switch-bg:theme(colors.brand.secondary.600)] dark:[--switch-bg-ring:transparent] dark:[--switch-bg:theme(colors.brand.secondary.600)]",
    "[--switch-ring:theme(colors.brand.secondary.600/90%)] [--switch-shadow:theme(colors.black/10%)] [--switch:white] dark:[--switch-ring:theme(colors.brand.secondary.700/90%)]",
  ],
  dark: [
    "[--switch-bg-ring:theme(colors.zinc.950/90%)] [--switch-bg:theme(colors.zinc.900)] dark:[--switch-bg-ring:theme(colors.white/15%)]",
    "[--switch-ring:theme(colors.zinc.950/90%)] [--switch-shadow:theme(colors.black/10%)] [--switch:white]",
  ],
  light: [
    "[--switch-bg-ring:theme(colors.black/15%)] [--switch-bg:white] dark:[--switch-bg-ring:transparent]",
    "[--switch-shadow:theme(colors.black/10%)] [--switch-ring:transparent] [--switch:theme(colors.zinc.950)]",
  ],
  neutral: [
    "[--switch-bg-ring:theme(colors.zinc.700/90%)] [--switch-bg:theme(colors.zinc.600)] dark:[--switch-bg-ring:transparent]",
    "[--switch-shadow:theme(colors.black/10%)] [--switch:white] [--switch-ring:theme(colors.zinc.700/90%)]",
  ],
  danger: [
    "[--switch-bg-ring:theme(colors.red.700/90%)] [--switch-bg:theme(colors.red.600)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:theme(colors.red.700/90%)] [--switch-shadow:theme(colors.red.900/20%)]",
  ],
  warning: [
    "[--switch-bg-ring:theme(colors.yellow.400/80%)] [--switch-bg:theme(colors.yellow.300)] dark:[--switch-bg-ring:transparent]",
    "[--switch-ring:transparent] [--switch-shadow:transparent] [--switch:theme(colors.yellow.950)]",
  ],
  success: [
    "[--switch-bg-ring:theme(colors.green.700/90%)] [--switch-bg:theme(colors.green.600)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:theme(colors.green.700/90%)] [--switch-shadow:theme(colors.green.900/20%)]",
  ],
  info: [
    "[--switch-bg-ring:theme(colors.sky.600/80%)] [--switch-bg:theme(colors.sky.500)] dark:[--switch-bg-ring:transparent]",
    "[--switch:white] [--switch-ring:theme(colors.sky.600/80%)] [--switch-shadow:theme(colors.sky.900/20%)]",
  ],
} satisfies VariantConfigMap<ThemeColors>;

type Color = keyof typeof colors;

export const SwitchContext =
  createContext<ContextValue<AriaSwitchProps, HTMLInputElement>>(null);
export const Switch = forwardRef(function Switch(
  props: AriaSwitchProps & {
    color?: Color;
  },
  ref: ForwardedRef<HTMLInputElement>
) {
  const { color = "secondary", ...racProps } = props;

  // Merge the local props and ref with the ones provided via context.
  [props, ref] = useContextProps(racProps, ref, SwitchContext);

  // Get field props to wire this input to a label
  const field = useSlottedContext(FieldContext);
  // Get controller to control field value via RHF
  const controller = useSlottedContext(FieldControllerContext);

  let inputRef = useObjectRef(mergeRefs(ref, controller?.field?.ref));

  let state = useToggleState(props);
  let {
    labelProps,
    inputProps,
    isSelected,
    isDisabled,
    isReadOnly,
    isPressed,
  } = useSwitch(
    {
      ...field,
      onChange: controller?.field?.onChange,
      onBlur: controller?.field?.onBlur,
      isSelected: controller?.field?.value,
      name: controller?.field?.name,
      ...removeDataAttributes(props),
      // ReactNode type doesn't allow function children.
      children: typeof props.children === "function" ? true : props.children,
    },
    state,
    inputRef
  );

  const { isFocused, isFocusVisible, focusProps } = useFocusRing();
  const isInteractionDisabled = props.isDisabled || props.isReadOnly;

  const { hoverProps, isHovered } = useHover({
    ...props,
    isDisabled: isInteractionDisabled,
  });

  const DOMProps = filterDOMProps(props);
  delete DOMProps.id;

  return (
    <div
      data-slot="control"
      {...mergeProps(DOMProps, labelProps, hoverProps)}
      slot={props.slot || undefined}
      data-selected={isSelected || undefined}
      data-pressed={isPressed || undefined}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
      data-disabled={isDisabled || undefined}
      data-readonly={isReadOnly || undefined}
      data-rac=""
    >
      <span
        data-selected={isSelected || undefined}
        data-pressed={isPressed || undefined}
        data-hovered={isHovered || undefined}
        data-focused={isFocused || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-disabled={isDisabled || undefined}
        className={clsx(
          props.className,
          // Base styles
          "group relative isolate inline-flex h-6 w-10 cursor-default rounded-full p-[3px] sm:h-5 sm:w-8",
          // Transitions
          "transition duration-0 ease-in-out data-[changing]:duration-200",
          // Outline and background color in forced-colors mode so switch is still visible
          "forced-colors:outline forced-colors:[--switch-bg:Highlight] dark:forced-colors:[--switch-bg:Highlight]",
          // Unchecked
          "bg-zinc-200 ring-1 ring-black/5 ring-inset dark:bg-white/5 dark:ring-white/15",
          // Checked
          "selected:bg-(--switch-bg) selected:ring-(--switch-bg-ring) dark:data-[selected]:bg-(--switch-bg) dark:data-[selected]:ring-(--switch-bg-ring)",
          // Focus
          "focus:outline focus:outline-offset-2 focus:outline-blue-500 focus:outline-none",
          // Hover
          "hover:ring-black/15 hover:data-[selected]:ring-[--switch-bg-ring]",
          "dark:hover:ring-white/25 dark:hover:data-[selected]:ring-[--switch-bg-ring]",
          // Disabled
          "data-[disabled]:bg-zinc-200 data-[disabled]:opacity-50 data-[disabled]:data-[selected]:bg-zinc-200 data-[disabled]:data-[selected]:ring-black/5",
          "dark:data-[disabled]:bg-white/15 dark:data-[disabled]:data-[selected]:bg-white/15 dark:data-[disabled]:data-[selected]:ring-white/15",
          // Color specific styles
          colors[color]
        )}
      >
        <span
          aria-hidden="true"
          className={clsx(
            // Basic layout
            "pointer-events-none relative inline-block size-[1.125rem] rounded-full sm:size-3.5",
            // Transition
            "translate-x-0 transition duration-200 ease-in-out",
            // Invisible border so the switch is still visible in forced-colors mode
            "border border-transparent",
            // Unchecked
            "bg-white ring-1 shadow ring-black/5",
            // Checked
            "group-data-[selected]:bg-[--switch] group-data-[selected]:shadow-[--switch-shadow] group-data-[selected]:ring-[--switch-ring]",
            "group-data-[selected]:translate-x-4 sm:group-data-[selected]:translate-x-3",
            // Disabled
            "group-data-[disabled]:group-data-[selected]:bg-white group-data-[disabled]:group-data-[selected]:shadow group-data-[disabled]:group-data-[selected]:ring-black/5"
          )}
        />
      </span>
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
});
