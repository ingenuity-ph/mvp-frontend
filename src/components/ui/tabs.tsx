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
import { plainButtonStyles } from "./button";
import { surfaceStyles } from "./surface";
import { cn } from "./utils";

export function Tabs(props: TabsProps) {
  // eslint-disable-next-line react/destructuring-assignment
  return <AriaTabs {...props} className={cn([props.className])} />;
}

export function TabList<T extends object>({ ...props }: TabListProps<T>) {
  return (
    <AriaTabList
      {...props}
      className={cn([
        props.className,
        [
          // Base
          "border-surface-border flex border-b",
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
        // Extend Button
        plainButtonStyles({ color: "neutral" }),
        //
        "group/tab",
      ])}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          // Base
          "absolute inset-x-0 bottom-0 h-0.5 translate-y-1/2",
          // Selected
          "group-[[data-selected]]/tab:bg-primary-500 group-not-[[data-selected]]/tab:border-transparent"
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
        // Inherit surface styles
        surfaceStyles({ color: "none", border: "none" }),
        // Bleed
        bleed && "[--gutter:0]"
      )}
    />
  );
}
