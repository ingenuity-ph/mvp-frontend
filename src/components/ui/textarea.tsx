import { clsx } from "clsx";
import { forwardRef } from "react";
import {
  TextArea as AriaTextArea,
  type TextAreaProps as AriaTextAreaProps,
  TextField as AriaTextField,
  useSlottedContext,
} from "react-aria-components";
import { mergeRefs, useObjectRef } from "@react-aria/utils";
import { FieldContext, FieldControllerContext } from "./fieldset";
import { cn } from "./utils";

export const Textarea = forwardRef(function Textarea(
  {
    className,
    resizable = true,
    ...props
  }: { className?: string; resizable?: boolean } & Omit<
    AriaTextAreaProps,
    "className"
  >,
  ref: React.ForwardedRef<HTMLTextAreaElement>,
) {
  const objectRef = useObjectRef(ref);
  const field = useSlottedContext(FieldContext);
  const fieldControl = useSlottedContext(FieldControllerContext)?.field;
  const mergedRef = mergeRefs(objectRef, fieldControl?.ref);

  return (
    <AriaTextField
      id={field?.id}
      aria-labelledby={field?.["aria-labelledby"]}
      data-slot="control"
      value={fieldControl?.value}
      name={fieldControl?.name}
      isDisabled={fieldControl?.disabled}
      className={clsx([
        className,
        // Basic layout
        "relative isolate block w-full",
        // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
        "before:absolute before:inset-px before:rounded-[calc(var(--radius-control)-1px)] before:bg-white before:shadow",
        // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
        "dark:before:hidden",
        // Focus ring
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[var(--radius-control)] after:ring-transparent after:ring-inset sm:has-[[data-focus-visible]]:after:ring-2 sm:has-[[data-focus-visible]]:after:ring-blue-500",
        // Disabled state
        "has-[[data-disabled]]:opacity-50 before:has-[[data-disabled]]:bg-zinc-950/5 before:has-[[data-disabled]]:shadow-none",
        // Invalid state
        "before:has-[[data-invalid]]:shadow-red-500/10",
      ])}
      onChange={fieldControl?.onChange}
      onBlur={fieldControl?.onBlur}
    >
      <div
        data-slot="input-container"
        className={cn([
          // Basic layout
          "relative flex rounded-[var(--radius-control)]",

          // Border
          "border-brand-border border has-[[data-hovered]]:border-zinc-950/20 dark:border-white/10 dark:has-[[data-hovered]]:border-white/20",
          // Background color
          "bg-transparent dark:bg-white/5",
          // Invalid state
          "group-data-[invalid]/field:border-red-500 group-data-[invalid]/field:hover:border-red-500 group-data-[invalid]/field:dark:border-red-500 group-data-[invalid]/field:hover:dark:border-red-500",
          // Disabled state
          "disabled:border-zinc-950/20 disabled:dark:border-white/15 disabled:dark:bg-white/[2.5%] dark:hover:disabled:border-white/15",
        ])}
      >
        <AriaTextArea
          ref={mergedRef}
          {...props}
          className={clsx([
            // Layout
            "block w-full appearance-none bg-transparent",
            // Typography
            "text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white",
            // Hide default focus styles
            "focus-within:outline-none focus:outline-none focus-visible:outline-none",
            // Padding
            "px-[calc(theme(spacing[3.5])-1px)] py-[calc(theme(spacing[2.5])-1px)] sm:px-[calc(theme(spacing[3])-1px)] sm:py-[calc(theme(spacing[1.5])-1px)]",
            // Resizable
            resizable ? "resize-y" : "resize-none",
          ])}
        />
      </div>
    </AriaTextField>
  );
});
