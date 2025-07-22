import type React from "react";
import {
  ButtonContext,
  DEFAULT_SLOT,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "./button";
import { cn } from "./utils";

const sizes = {
  xs: "sm:max-w-xs",
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  "4xl": "sm:max-w-4xl",
  "5xl": "sm:max-w-5xl",
};

const dialogStyles = tv({
  base: [
    // Base
    "[&>[data-slot=label]+[data-slot=description]]:mt-2",
    "[&>[data-slot=title]+[data-slot=description]]:mt-2",
    // Content
    "[&>[data-slot=header]+[data-slot=content]]:mt-6",
  ],
});

interface OwnProps {
  onClose?: () => void;
}

export type DialogProps = {
  size?: keyof typeof sizes;
  children: React.ReactNode;
} & AriaModalOverlayProps &
  Pick<AriaDialogProps, "role"> &
  OwnProps;

export function Dialog({
  size = "lg",
  isDismissable = true,
  role,
  className,
  children,
  onClose: onCloseHandler,
  ...props
}: DialogProps) {
  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={cn([
        "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-neutral-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-neutral-950/65",
        //Enter Animations
        "entering:animate-in entering:fade-in entering:duration-300 entering:ease-out",
        // Exit Animations
        "exiting:animate-out exiting:fade-out exiting:duration-200 exiting:ease-in",
      ])}
      onOpenChange={(isOpen) => {
        props.onOpenChange?.(isOpen);
        if (!isOpen) {
          onCloseHandler?.();
        }
      }}
    >
      {({ state }) => {
        return (
          <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
            <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
              <AriaModal
                className={cn([
                  sizes[size],
                  // Base
                  "row-start-2 w-full min-w-0",
                  //Enter Animations
                  "entering:animate-in entering:fade-in entering:slide-in-from-bottom-4 entering:duration-200",
                  // Exit Animations
                  "exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom exiting:duration-200",
                ])}
              >
                <ButtonContext.Provider
                  value={{
                    slots: {
                      [DEFAULT_SLOT]: {},
                      close: {
                        onPress: () => {
                          state.close();
                        },
                      },
                    },
                  }}
                >
                  <AriaDialog
                    role={role}
                    className={cn(
                      className,
                      sizes[size],
                      // Base
                      "bg-surface-background relative row-start-2 w-full min-w-0 rounded-t-(--radius-surface) p-[var(--gutter,var(--spacing-surface-gutter))] ring-1 shadow-lg ring-neutral-950/10 outline-none sm:mb-auto sm:rounded-(--radius-surface) dark:ring-white/10 forced-colors:outline",
                      //
                      dialogStyles()
                    )}
                  >
                    {isDismissable && (
                      <span className="right-surface absolute top-1.5 flex">
                        <Button
                          slot="close"
                          color="neutral"
                          variant="plain"
                          className="h-9.5"
                          inset="right"
                          aria-label="Close Dialog"
                        >
                          <XIcon />
                        </Button>
                      </span>
                    )}
                    {children}
                  </AriaDialog>
                </ButtonContext.Provider>
              </AriaModal>
            </div>
          </div>
        );
      }}
    </AriaModalOverlay>
  );
}

export function AlertDialog(props: Omit<DialogProps, "isDismissable">) {
  return (
    <Dialog
      {...props}
      isKeyboardDismissDisabled
      role="alertdialog"
      isDismissable={false}
    />
  );
}

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn(
        className,
        "mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto"
      )}
    />
  );
}
