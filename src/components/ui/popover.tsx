import {
  Dialog,
  Popover as AriaPopover,
  type PopoverProps as AriaPopoverProps,
} from "react-aria-components";
import { surfaceStyles } from "./surface";
import { cn } from "./utils";

export type PopoverProps = AriaPopoverProps;

export function Popover({
  children,
  bleed = false,
  ...props
}: {
  children: React.ReactNode;
  bleed?: boolean;
} & AriaPopoverProps) {
  return (
    <AriaPopover
      {...props}
      className={cn([
        // Extend Surface
        surfaceStyles(),
        //
        bleed && "[--gutter:0]",
        // Base styles
        "isolate",
        // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
        "outline outline-transparent focus:outline-none",
        // Handle scrolling when menu won't fit in viewport
        "overflow-y-auto",
        // Animation
        "slide-in-from-left-1 entering:animate-in entering:fade-in exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-1",
        // Placement aware animation
        "data-[placement=bottom]:entering:slide-in-from-top-1 data-[placement=left]:entering:slide-in-from-right-1 data-[placement=right]:entering:slide-in-from-left-1 data-[placement=top]:entering:slide-in-from-bottom-1",
        //
        props.className,
      ])}
    >
      {children}
    </AriaPopover>
  );
}

export function PopoverDialog({
  children,
  bleed = false,
  ...props
}: {
  children: React.ReactNode;
  bleed?: boolean;
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
        className={cn(
          // Extend Surface
          surfaceStyles(),
          //
          bleed && "[--gutter:0]",
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
