import { clsx } from "clsx";
import { createContext, useContext } from "react";
import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
  Heading,
  type HeadingProps,
  Text as AriaText,
  type TextProps as AriaTextProps,
} from "react-aria-components";
import { tv, type VariantProps } from "tailwind-variants";
import type { ColorMap, ThemeColors } from "./constants";
import { Link, type LinkProps } from "./link";

export const textStyles = tv({
  base: "text-[color:var(--text-color)]",
  variants: {
    level: {
      // Display
      "display-lg": "text-[6rem] leading-[7rem]",
      "display-md": "text-[3.25rem] leading-[4rem]",
      "display-sm": "text-[2.75rem] leading-[3.25]",
      "display-xs": "text-[2.25rem] leading-[2.74]",
      // Heading
      h1: "text-[2.5rem] leading-[3.25rem]",
      h2: "text-[2.25rem] leading-[2.75rem]",
      h3: "text-[2rem] leading-[2.5rem]",
      h4: "text-[1.75rem] leading-[2.25rem]",
      h5: "text-[1.5rem] leading-[2rem]",
      h6: "text-[1.25rem] leading-[1.75rem]",
      // Labels
      "label-lg": "sm:text-[1.125rem] sm:leading-[1.5rem]",
      "label-md": "sm:text-[1rem] sm:leading-[1.25rem]",
      "label-sm": "sm:text-[0.875rem] sm:leading-[1rem]",
      "label-xs": "sm:text-[0.75rem] sm:leading-[1rem]",
      // Paragraph
      "paragraph-lg": "text-[1.125rem] leading-[1.75rem]",
      "paragraph-md": "text-[1rem] leading-[1.5rem]",
      "paragraph-sm": "text-[0.875rem] leading-[1.25rem]",
      "paragraph-xs": "text-[0.75rem] leading-[1.25rem]",

      // using inherit means we want to "inherit" the styles from parent
      inherit: "",
    },
    colors: {
      primary: [
        "[--text-color:theme(colors.brand.primary.500)]",
        "dark:[--text-color:theme(colors.brand.primary.100)]",
      ],
      secondary: [
        "[--text-color:theme(colors.brand.secondary.600)]",
        "dark:[--text-color:theme(colors.brand.secondary.500)]",
      ],
      light: [
        "[--text-color:white]",
        "dark:[--text-color:theme(colors.zinc.800)]",
      ],
      dark: [
        "[--text-color:theme(colors.zinc.900)]",
        "dark:[--text-color:theme(colors.zinc.50)]",
      ],
      neutral: [
        "[--text-color:theme(colors.zinc.500)]",
        "dark:[--text-color:theme(colors.zinc.400)]",
      ],
      danger: [
        "[--text-color:theme(colors.red.500)]",
        "dark:[--text-color:theme(colors.red.400)]",
      ],
      success: [
        "[--text-color:theme(colors.green.500)]",
        "dark:[--text-color:theme(colors.green.400)]",
      ],
      warning: [
        "[--text-color:theme(colors.amber.500)]",
        "dark:[--text-color:theme(colors.amber.400)]",
      ],
      info: [
        "[--text-color:theme(colors.sky.500)]",
        "dark:[--text-color:theme(colors.sky.400)]",
      ],
    } satisfies ColorMap,
  },
  defaultVariants: {
    level: "paragraph-md",
  },
});

/**
 * @internal
 * For creating nested Typography to have inherit level (unless an explicit `level` prop is provided)
 * and change the HTML tag to `span` (unless an explicit `component` prop is provided).
 * https://github.com/mui/material-ui/blob/master/packages/mui-joy/src/Typography/Typography.tsx
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
const _TextNestedContext = createContext(false);

/**
 * @internal
 * Typography's level will be inherit within this context unless an explicit `level` prop is provided.
 *
 * This is used in components, for example Table, to inherit the parent's size by default.
 * https://github.com/mui/material-ui/blob/master/packages/mui-joy/src/Typography/Typography.tsx
 */
export const TypographyInheritContext = createContext(false);

type TextStyles = VariantProps<typeof textStyles>;
type CustomColor = `text-${string} dark:text-${string}`;
interface OwnTextProps {
  color?: TextStyles["colors"] | CustomColor | "inherit";
  level?: TextStyles["level"];
}

export type TextProps = AriaTextProps & OwnTextProps;
export function Text({
  className,
  level = "paragraph-md",
  color = "dark",
  ...props
}: TextProps) {
  const isNested = useContext(_TextNestedContext);

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const inheritColor = color === "inherit";
  const isThemeColor = Object.keys(textStyles.variants.colors).includes(color);
  const colorStyle = isThemeColor
    ? textStyles.variants.colors[color as ThemeColors]
    : color;

  return (
    <_TextNestedContext.Provider value>
      <AriaText
        data-slot="text"
        elementType={isNested ? "span" : "p"}
        /**
         * We want to force `null` to be able to use this component without conflicts to RAC
         * components without `DEFAULT_SLOT` implemented.
         */
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        slot={null}
        {...props}
        className={clsx(
          className,
          textStyles({ level }),
          /**
           * Text color will inherit styles applied to parent.
           */
          inheritColor ? "" : colorStyle,
        )}
      />
    </_TextNestedContext.Provider>
  );
}

export function TextLink({
  className,
  color = "neutral",
  level = "paragraph-md",
  ...props
}: LinkProps & OwnTextProps) {
  const isColor = typeof color === "string";
  const colorStyle = isColor
    ? textStyles.variants.colors[color as ThemeColors]
    : color;

  return (
    <Link
      {...props}
      className={clsx(
        className,
        "underline",
        textStyles({ level }),
        "text-[color:var(--text-color)]",
        colorStyle,
      )}
    />
  );
}

export function TextButton({
  className,
  color = "dark",
  level = "paragraph-md",
  ...props
}: Omit<AriaButtonProps, "color"> & OwnTextProps) {
  const isColor = typeof color === "string";
  const colorStyle = isColor
    ? textStyles.variants.colors[color as ThemeColors]
    : color;

  return (
    <AriaButton
      {...props}
      className={clsx(
        className,
        // Base
        "relative isolate inline-flex items-center justify-center gap-x-2 focus:outline-none",
        // Icon
        "forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText] [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
        // Text
        "text-[color:var(--text-color)]",
        textStyles({ level }),
        colorStyle,
      )}
    />
  );
}

export function Strong({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"strong">) {
  return (
    <strong
      {...props}
      className={clsx(className, "font-medium text-zinc-950 dark:text-white")}
    />
  );
}

export function Code({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"code">) {
  return (
    <code
      {...props}
      className={clsx(
        className,
        "rounded border border-zinc-950/10 bg-zinc-950/[2.5%] px-0.5 text-sm font-medium text-zinc-950 sm:text-[0.8125rem] dark:border-white/20 dark:bg-white/5 dark:text-white",
      )}
    />
  );
}

export function Title({ className, ...props }: HeadingProps) {
  return (
    <Heading
      {...props}
      className={clsx(
        className,
        "font-semibold text-balance",
        textStyles({ level: "label-md", colors: "dark" }),
      )}
    />
  );
}
