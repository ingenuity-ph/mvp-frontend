import clsx, { type ClassValue } from "clsx";
import React, {
  type ComponentPropsWithoutRef,
  type RefCallback,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { tv } from "tailwind-variants";
import { defaultConfig } from "tailwind-variants";
import {
  Group as AriaGroup,
  type GroupProps as AriaGroupProps,
  GroupContext as AriaGroupContext,
  useContextProps,
} from "react-aria-components";
import { useObjectRef } from "react-aria";
/**
 * DISABLE TW MERGE to prevent foot gun
 */
defaultConfig.twMerge = false;

export const cn = (...classes: ClassValue[]) => clsx(classes);

export const focusRing = tv({
  base: "outline outline-0 outline-offset-2 outline-blue-600 focus-visible:outline-2 dark:outline-blue-500 forced-colors:outline-[Highlight]",
});

/**
 * Wraps a group of elements in an EnhancerGroup component
 * and applies appropriate styles to enhancers(icons, badges, etc)
 */
export function EnhancerGroup({
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={clsx([
        // Base
        "inline-flex gap-x-2",
        // Icon
        "[&_[data-slot=icon]]:size-5 [&_[data-slot=icon]]:shrink-0 [&_[data-slot=icon]]:sm:size-4",
        //
        className,
      ])}
    />
  );
}

type GroupProps = AriaGroupProps & {
  adjoined?: boolean;
  orientation?: "horizontal" | "vertical";
};
export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  function Group(props, ref) {
    const _ref = useObjectRef(ref);
    [props, ref] = useContextProps(props, _ref, AriaGroupContext);
    const { adjoined, orientation = "horizontal", ...groupProps } = props;

    return (
      <AriaGroup
        ref={ref}
        {...groupProps}
        data-adjoined={adjoined}
        data-orientation={orientation}
      />
    );
  }
);

// https://github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L209
export function useSlot(): [RefCallback<Element>, boolean] {
  // Assume we do have the slot in the initial render.
  const [hasSlot, setHasSlot] = useState(true);
  const hasRun = useRef(false);

  // A callback ref which will run when the slotted element mounts.
  // This should happen before the useLayoutEffect below.
  const ref = useCallback((el: unknown) => {
    hasRun.current = true;
    setHasSlot(!!el);
  }, []);

  // If the callback hasn't been called, then reset to false.
  useLayoutEffect(() => {
    if (!hasRun.current) {
      setHasSlot(false);
    }
  }, []);

  return [ref, hasSlot];
}

//github.com/adobe/react-spectrum/blob/main/packages/react-aria-components/src/utils.tsx#L309
/**
 * Filters out `data-*` attributes to keep them from being passed down and duplicated.
 * @param props
 */
export function removeDataAttributes<T>(props: T): T {
  const prefix = /^(data-.*)$/;
  let filteredProps = {} as T;

  for (const prop in props) {
    if (!prefix.test(prop)) {
      filteredProps[prop] = props[prop];
    }
  }

  return filteredProps;
}

/**
 * https://github.com/adobe/react-spectrum/blob/main/packages/%40react-spectrum/s2/src/types.ts#L21
 */
// Override forwardRef types so generics work.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare function forwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactElement | null
): (props: P & React.RefAttributes<T>) => React.ReactElement | null;

export type forwardRefType = typeof forwardRef;
