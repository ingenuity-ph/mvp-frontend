import clsx from "clsx";
import {
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
  Dialog,
} from "react-aria-components";
import { cn } from "./utils";
import { surfaceStyles } from "./surface";

export function Popover({
  children,
  ...props
}: {
  children: React.ReactNode;
} & AriaPopoverProps) {
  return (
    <AriaPopover
      {...props}
      className={cn([
        // Animation
        "slide-in-from-left-1 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-1",
        // Placement aware animation
        "data-[placement=bottom]:entering:slide-in-from-top-1 data-[placement=left]:entering:slide-in-from-right-1 data-[placement=right]:entering:slide-in-from-left-1 data-[placement=top]:entering:slide-in-from-bottom-1",
      ])}
    >
      {/* <OverlayArrow>
        <svg width={12} height={12} viewBox="0 0 12 12">
          <path d="M0 0 L6 6 L12 0" />
        </svg>
      </OverlayArrow> */}
      <Dialog
        className={clsx(
          // Extend Surface
          surfaceStyles(),
          // Base styles
          "isolate",
          // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
          "outline outline-transparent focus:outline-none",
          // Handle scrolling when menu won't fit in viewport
          "overflow-y-auto",
          //
          props.className
        )}
      >
        {children}
      </Dialog>
    </AriaPopover>
  );
}
