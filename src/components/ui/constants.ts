type CORE_PALLETE = "primary" | "secondary" | "neutral";
type SUPPORTED_COLORS =
  | "light"
  | "dark"
  | "danger"
  | "warning"
  | "success"
  | "info";
export type ThemeColors = CORE_PALLETE | SUPPORTED_COLORS;
export type ColorMap = Record<ThemeColors, string[] | string>;

export type VariantConfigMap<T extends string | number | symbol> = Record<
  T,
  string | Array<string>
>;

export type Variant = "solid" | "outline" | "plain" | "unstyled";
export type VariantMap = Record<Variant, string>;

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
export type SizeMap = Record<Sizes, string[]>;
