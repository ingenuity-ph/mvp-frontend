import clsx from "clsx";
import type React from "react";
import {
  ButtonContext,
  DEFAULT_SLOT,
  Dialog as AriaDialog,
  type DialogProps as AriaDialogProps,
  Heading,
  type HeadingProps,
  Modal as AriaModal,
  ModalOverlay as AriaModalOverlay,
  type ModalOverlayProps as AriaModalOverlayProps,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { X } from "@phosphor-icons/react";
import { Button } from "./button";
import { Description } from "./fieldset";
import { textStyles } from "./text";

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

export type DialogProps = {
  size?: keyof typeof sizes;
  children: React.ReactNode;
} & AriaModalOverlayProps &
  Pick<AriaDialogProps, "role">;

export function Dialog({
  size = "lg",
  isDismissable = true,
  role,
  className,
  children,
  ...props
}: DialogProps) {
  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={clsx([
        "fixed inset-0 flex w-screen justify-center overflow-y-auto bg-zinc-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/65",
        // Enter Animation
        "entering:opacity-100 entering:duration-100 entering:ease-out opacity-0",
        // Exit Animation
        "exiting:opacity-0 exiting:duration-100 exiting:ease-in opacity-100",
      ])}
    >
      {({ state }) => {
        return (
          <div className="fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
            <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
              <AriaModal
                className={clsx([
                  sizes[size],
                  // Base
                  "row-start-2 w-full min-w-0",
                  // Animations
                  "entering:animate-in entering:fade-in entering:zoom-in-95 exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-2",
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
                    className={clsx(
                      className,
                      sizes[size],
                      // Base
                      "bg-surface-background relative row-start-2 w-full min-w-0 rounded-t-(--radius-surface) p-[var(--gutter,theme(spacing.4))] ring-1 shadow-lg ring-zinc-950/10 outline-none sm:mb-auto sm:rounded-(--radius-surface) dark:ring-white/10 forced-colors:outline",
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
                          <X />
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

export function DialogTitle({ className, ...props }: HeadingProps) {
  return (
    <Heading
      {...props}
      slot="title"
      className={clsx(
        className,
        "font-semibold text-balance",
        textStyles({ level: "label-md", colors: "dark" }),
      )}
    />
  );
}

export function DialogDescription({ className, ...props }: AriaTextProps) {
  return (
    <Description {...props} className={clsx(className, "mt-2 text-pretty")} />
  );
}

export function DialogBody({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return <div {...props} className={clsx(className, "mt-6")} />;
}

export function DialogActions({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        "mt-8 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto",
      )}
    />
  );
}
