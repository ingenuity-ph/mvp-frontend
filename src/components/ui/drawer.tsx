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
import { tv, type VariantProps } from "tailwind-variants";
import { cn } from "./utils";

const drawerStyles = tv({
  variants: {
    size: {
      xs: "sm:max-w-xs",
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      "3xl": "sm:max-w-3xl",
      "4xl": "sm:max-w-4xl",
      "5xl": "sm:max-w-5xl",
      full: "sm:max-w-full",
    },
    position: {
      top: "grid-rows-[1fr_auto] sm:grid-rows-[auto_3fr_1fr]",
      right:
        "grid-rows-[1fr_auto] sm:grid-rows-[1fr_auto_3fr] sm:justify-items-end",
      bottom: "grid-rows-[1fr_auto] sm:grid-rows-[1fr_3fr_auto]",
      left: "grid-cols-[1fr_auto] sm:grid-cols-[1fr_auto_3fr] sm:justify-items-end",
    },
    inset: {
      top: "data-[inset*=top]:pt-0",
      right: "data-[inset*=right]:pr-0",
      bottom: "data-[inset*=bottom]:pb-0",
      left: "data-[inset*=left]:pl-0",
      all: "p-0",
      none: "",
    },
  },
  defaultVariants: {
    size: "lg",
    inset: "none",
  },
});

const positions = {
  top: "grid-rows-[1fr_auto] sm:grid-rows-[auto_3fr_1fr]",
  right:
    "grid-rows-[1fr_auto] sm:justify-items-end sm:grid-rows-[1fr_auto_3fr]",
  bottom: "grid-rows-[1fr_auto] sm:grid-rows-[1fr_3fr_auto]",
  left: "grid-cols-[1fr_auto] sm:justify-items-end sm:grid-cols-[1fr_auto_3fr]",
};

const positionAnimation: Record<keyof typeof positions, Array<string>> = {
  top: [
    // Animations
    "entering:animate-in entering:fade-in entering:slide-in-from-top-2 exiting:animate-out exiting:fade-out exiting:slide-out-to-top-2",
  ],
  right: [
    // Animations
    "entering:animate-in entering:fade-in entering:slide-in-from-right-4 exiting:animate-out exiting:fade-out exiting:slide-out-to-right-2",
  ],
  bottom: [
    // Animations
    "entering:animate-in entering:fade-in entering:slide-in-from-bottom-2 exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-2",
  ],
  left: [
    // Animations
    "entering:animate-in entering:fade-in entering:slide-in-from-bottom-2 exiting:animate-out exiting:fade-out exiting:slide-out-to-bottom-2",
  ],
};

type DrawerVariants = VariantProps<typeof drawerStyles>;

export type DrawerProps = {
  children: React.ReactNode;
} & Omit<DrawerVariants, "inset"> & {
    inset?: DrawerVariants["inset"] | Array<DrawerVariants["inset"]>;
  } & AriaModalOverlayProps &
  Pick<AriaDialogProps, "role">;

const matchMultipleInset = (insets: Array<DrawerVariants["inset"]>) => {
  return cn(
    insets.map((inset) => (inset ? drawerStyles.variants.inset[inset] : "")),
  );
};

export function Drawer({
  size = "sm",
  position = "right",
  inset = "none",
  isDismissable = true,
  role,
  className,
  children,
  ...props
}: DrawerProps) {
  const insetStyle = Array.isArray(inset)
    ? matchMultipleInset(inset)
    : drawerStyles.variants.inset[inset];

  return (
    <AriaModalOverlay
      {...props}
      isDismissable={isDismissable}
      className={cn([
        "fixed inset-0 flex w-screen justify-center overflow-hidden bg-zinc-950/25 px-2 py-2 focus:outline-0 sm:px-6 sm:py-8 lg:px-8 lg:py-16 dark:bg-zinc-950/65",
        // Enter Animation
        "entering:opacity-100 entering:duration-100 entering:ease-out opacity-0",
        // Exit Animation
        "exiting:opacity-0 exiting:duration-100 exiting:ease-in opacity-100",
      ])}
    >
      {({ state }) => {
        return (
          <div
            className={cn([
              "fixed inset-0 w-screen overflow-hidden sm:pt-0",
              size === "full" ? "" : "pt-6",
            ])}
          >
            <div
              data-inset={Array.isArray(inset) ? inset.join(" ") : inset}
              className={cn([
                // Base
                "grid h-full min-h-full sm:p-4",
                // Inset
                insetStyle,
                // Position
                drawerStyles.variants.position[position],
              ])}
            >
              <AriaModal
                className={cn([
                  drawerStyles.variants.size[size],
                  // Base
                  "row-span-full w-full min-w-0",
                  // Animation
                  positionAnimation[position],
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
                      drawerStyles.variants.size[size],
                      // Base
                      "bg-surface-background sm:rounded-surface rounded-t-surface h-full w-full min-w-0 overflow-y-auto p-[var(--gutter,var(--spacing-surface))] ring-1 shadow-lg ring-zinc-950/10 outline-none sm:mb-auto dark:ring-white/10 forced-colors:outline",
                    )}
                  >
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
