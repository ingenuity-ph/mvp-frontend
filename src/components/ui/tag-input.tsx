import { mergeProps } from "react-aria";
import { useSlottedContext } from "react-aria-components";
import { normalizeProps, useMachine } from "@zag-js/react";
import * as tagsInput from "@zag-js/tags-input";
import { FieldContext, FieldControllerContext } from "./fieldset";
import { cn } from "./utils";

type TagInputProps = tagsInput.Props;

export function TagInput(props: Partial<TagInputProps>) {
  const field = useSlottedContext(FieldContext);
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const service = useMachine(tagsInput.machine, {
    ...mergeProps(props, {
      name: fieldControl?.name,
      id: field?.id,
      disabled: fieldControl?.disabled,
      value: fieldControl?.value,
      onValueChange(details) {
        fieldControl?.onChange(details.value);
      },
      onFocusOutside: () => {
        fieldControl?.onBlur();
      },
    } satisfies Partial<TagInputProps>),
  });

  const api = tagsInput.connect(service, normalizeProps);

  return (
    <div
      {...api.getRootProps()}
      data-slot="control"
      className={cn([
        // Basic layout
        "group relative isolate block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-control)] after:ring-transparent after:ring-inset sm:has-[:focus]:after:ring-2 sm:has-[:focus]:after:ring-blue-500",
        // Disabled state
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-neutral-950/5 before:has-[[data-disabled]]:shadow-none",
        // Invalid state
        "before:has-[[data-invalid]]:shadow-danger-500/10",
      ])}
    >
      <div
        {...api.getControlProps()}
        data-slot="input-container"
        className={cn([
          // Basic layout
          "relative flex flex-wrap rounded-[var(--radius-control)]",
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
        ])}
      >
        <div
          className={cn([
            //
            "inline-flex flex-wrap gap-2 pr-2 group-data-empty:hidden",
            //
            "my-[calc(theme(spacing[2.5])-1px)] sm:my-[calc(theme(spacing[1.5])-1px)]",
          ])}
        >
          {api.value.map((value, index) => {
            return (
              <span
                key={value}
                {...api.getItemProps({ index, value })}
                className={cn([
                  "inline-flex shrink-0 items-center gap-x-1.5 rounded-md px-1.5 py-0.5 text-sm/5 font-medium sm:text-xs/5 forced-colors:outline",
                  // Icon
                  "forced-colors:[--btn-icon:ButtonText] forced-colors:data-[hovered]:[--btn-icon:ButtonText] [&_[data-slot=icon]]:-mx-0.5 [&_[data-slot=icon]]:my-0.5 [&_[data-slot=icon]]:size-5 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:text-[--btn-icon] [&_[data-slot=icon]]:sm:my-1 [&_[data-slot=icon]]:sm:size-4",
                  //Color
                  "bg-neutral-600/10 text-neutral-700 group-data-[hovered]:bg-neutral-600/20 dark:bg-white/5 dark:text-neutral-400 dark:group-data-[hovered]:bg-white/10",
                ])}
              >
                <div
                  {...api.getItemPreviewProps({ index, value })}
                  className="flex items-center gap-2"
                >
                  <span className="shrink-0">{value} </span>
                  <button {...api.getItemDeleteTriggerProps({ index, value })}>
                    &#x2715;
                  </button>
                </div>
                <input {...api.getItemInputProps({ index, value })} />
              </span>
            );
          })}
        </div>
        <input
          placeholder="example@gmail.com"
          {...api.getInputProps()}
          className={cn([
            // Layout
            "inline-block min-w-0 appearance-none bg-transparent",
            // Typography
            "text-base/6 text-neutral-950 placeholder:text-neutral-500 sm:text-sm/6 dark:text-white",
            // Hide default focus styles
            "focus:outline-none",
            // Vertical Padding - we only apply the vertical padding to the input itself to have consistent dimensions
            // when the padding is applied on the wrapper the padding does not collapse properly
            "py-[calc(theme(spacing[2.5])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
          ])}
        />
      </div>
    </div>
  );
}
