import { CaretDownIcon } from "@phosphor-icons/react";
import { mergeProps } from "react-aria";
import {
  ComboBox as AriaCombobox,
  type ComboBoxProps as AriaComboboxProps,
  ListBox,
  Popover,
} from "react-aria-components";
import type { Adjoined } from "./constants";
import { useFieldController, useFieldProps } from "./fieldset";
import { cn, type forwardRefType } from "./utils";
import { forwardRef, useCallback, useRef, useState } from "react";
import { useResizeObserver } from "@react-aria/utils";
import { Button } from "./button";
import { Input } from "./input";
import { pickerStyles } from "./picker";

export type ComboBoxProps<T extends object> = {
  className?: string;
  adjoined?: Adjoined;
  items?: Iterable<T>;
  placeholder?: string;
  children: React.ReactNode | ((item: T) => React.ReactNode);
} & Omit<AriaComboboxProps<T>, "className" | "children">;

export function _ComboboxInternal<T extends object>(
  {
    className,
    children,
    adjoined = "none",
    isDisabled = false,
    items,
    placeholder,
    ...props
  }: ComboBoxProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const field = useFieldProps();
  const resolvedIsDisabled = isDisabled || field?.isDisabled;

  const controller = useFieldController();
  const fieldControl = controller?.field;

  // Allows calendar width to match input group
  let controlRef = useRef<HTMLDivElement>(null);
  let [controlWidth, setControlWidth] = useState<string | null>(null);
  let onResize = useCallback(() => {
    if (controlRef.current) {
      setControlWidth(controlRef.current.offsetWidth + "px");
    }
  }, []);

  useResizeObserver({
    ref: controlRef,
    onResize: onResize,
  });

  return (
    <div data-slot="control" className="block isolate">
      <AriaCombobox
        ref={ref}
        {...mergeProps(props, { isDisabled: resolvedIsDisabled }, field, {
          onSelectionChange: fieldControl?.onChange,
          onBlur: fieldControl?.onBlur,
          selectedKey: fieldControl?.value,
        } satisfies Partial<ComboBoxProps<T>>)}
        data-adjoined={adjoined}
        className={cn([
          className,
          // Adjoined
          // adjoinedStyles({ direction: adjoined }),
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
        <div ref={controlRef}>
          <Input
            placeholder={placeholder}
            endEnhancer={
              <Button data-slot="action" variant="plain" inset="right">
                <span data-slot="icon">
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
            }
          />
        </div>
        <Popover
          triggerRef={controlRef}
          trigger="ComboBox"
          style={{ "--trigger-width": controlWidth } as React.CSSProperties}
        >
          <ListBox
            items={items}
            className={cn(pickerStyles().list({ className: "max-h-64" }))}
          >
            {children}
          </ListBox>
        </Popover>
      </AriaCombobox>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/naming-convention
const Combobox = (forwardRef as forwardRefType)(_ComboboxInternal);

export { Combobox };
