/* eslint-disable @typescript-eslint/naming-convention */
type SUPPORTED_COLORS =
  | "primary"
  | "neutral"
  | "danger"
  | "warning"
  | "success"
  | "info";
export type ThemeColors = SUPPORTED_COLORS;
export type ColorMap = Record<ThemeColors | "none", Array<string> | string>;

export type VariantConfigMap<T extends string | number | symbol> = Record<
  T,
  string | Array<string>
>;

export type Variant = "solid" | "outline" | "plain" | "unstyled";
export type VariantMap = Record<Variant, string>;

export type Shape = "square" | "circle";
export type Emphasis = "muted" | "subtle" | "bold";

export type Inset = "top" | "right" | "bottom" | "left" | "none" | "all";

export const ADJOINED = {
  none: "none",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
} as const;
export type Adjoined = keyof typeof ADJOINED;

export type Orientation = "horizontal" | "vertical";

export type Sizes = "sm" | "md" | "lg";
export type SizeMap = Record<Sizes, Array<string>>;
