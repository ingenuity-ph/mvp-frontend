import {
  Tab as AriaTab,
  TabList as AriaTabList,
  type TabListProps,
  TabPanel as AriaTabPanel,
  type TabPanelProps as AriaTabPanelProps,
  type TabProps,
  Tabs as AriaTabs,
  type TabsProps,
} from "react-aria-components";
import { cn } from "./utils";

type Variants = "outline" | "plain";

export function Tabs(props: TabsProps) {
  // eslint-disable-next-line react/destructuring-assignment
  return <AriaTabs {...props} className={cn([props.className])} />;
}

export function TabList<T extends object>({
  variant = "outline",
  ...props
}: TabListProps<T> & { variant?: Variants }) {
  return (
    <AriaTabList
      {...props}
      className={cn([
        props.className,
        [
          // Base
          "border-brand-border flex border-b",
          //   Variant
          variant === "outline" && "dark:divide-brand-border divide-x",
        ],
      ])}
    />
  );
}

export function Tab({
  children,
  ...props
}: Omit<TabProps, "children"> & { children: React.ReactNode }) {
  return (
    <AriaTab
      {...props}
      className={cn([
        props.className,
        // Base
        "relative isolate inline-flex cursor-default items-center justify-center gap-x-2 text-base/6 font-medium",
        // Focus
        "focus:outline-none focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-500",
        // Disabled
        "disabled:opacity-50",
        // Icon
        "forced-colors:[--btn-icon:ButtonText] forced-colors:hover:[--btn-icon:ButtonText] [&>[data-slot=icon]]:-mx-0.5 [&>[data-slot=icon]]:my-0.5 [&>[data-slot=icon]]:size-5 [&>[data-slot=icon]]:shrink-0 [&>[data-slot=icon]]:text-[--btn-icon] [&>[data-slot=icon]]:sm:my-1 [&>[data-slot=icon]]:sm:size-4",
        // Group
        "group relative",
        // Sizing (48px)
        "px-[calc(theme(spacing[5])-1px)] py-[calc(theme(spacing[3])-1px)]",
        // Variant
        "hover:bg-brand-primary-50 hover:text-brand-primary-600 pressed:bg-brand-primary-950/[2.5%] pressed:text-zinc-950 border-zinc-950/10 text-zinc-950",
        // Dark mode
        "dark:pressed:bg-white/10 dark:text-white dark:hover:bg-white/10",
        // Icon
        "pressed:[--btn-icon:theme(colors.zinc.700)] [--btn-icon:theme(colors.zinc.500)] hover:[--btn-icon:theme(colors.zinc.700)] dark:[--btn-icon:theme(colors.zinc.500)] dark:hover:[--btn-icon:theme(colors.zinc.400)] dark:data-[active]:[--btn-icon:theme(colors.zinc.400)]",
        // Selected
        "selected:text-brand-primary-600",
      ])}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          // Base
          "absolute inset-x-0 bottom-0 h-0.5",
          // Selected
          "group-data-selected:bg-brand-primary-500 group-not-data-selected:border-transparent",
        )}
      />
    </AriaTab>
  );
}

type TabPanelProps = AriaTabPanelProps & { bleed?: boolean };
export function TabPanel({ bleed = false, ...props }: TabPanelProps) {
  return (
    <AriaTabPanel
      {...props}
      className={cn(
        props.className,
        // Base
        "rounded-[var(--surface-radius)] forced-colors:outline",
        // Layout
        "flex flex-col gap-[var(--gutter,var(--surface-gutter))]",
        // Bleed
        !bleed && "p-[var(--gutter,theme(spacing.4))]",
      )}
    />
  );
}
