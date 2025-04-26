import * as React from "react";
import {
  type AriaLinkOptions,
  mergeProps,
  useFocusRing,
  useHover,
  useLink,
  useObjectRef,
} from "react-aria";
import { createLink, type LinkComponent } from "@tanstack/react-router";

interface RACLinkProps extends Omit<AriaLinkOptions, "href"> {
  children?: React.ReactNode;
  className?: string;
}

const InternalLink = React.forwardRef<HTMLAnchorElement, RACLinkProps>(
  function InternalLink(props, forwardedRef) {
    const ref = useObjectRef(forwardedRef);

    const { isPressed, linkProps } = useLink(props, ref);
    const { isHovered, hoverProps } = useHover(props);
    const { isFocusVisible, isFocused, focusProps } = useFocusRing(props);

    return (
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      <a
        {...mergeProps(linkProps, hoverProps, focusProps, props)}
        ref={ref}
        data-hovered={isHovered || undefined}
        data-pressed={isPressed || undefined}
        data-focus-visible={isFocusVisible || undefined}
        data-focused={isFocused || undefined}
      />
    );
  },
);

export const AriaTanstackLink = createLink(InternalLink);

export type LinkProps = React.ComponentProps<
  LinkComponent<typeof AriaTanstackLink>
>;

// eslint-disable-next-line react/function-component-definition
export const Link: LinkComponent<typeof AriaTanstackLink> = (props) => {
  return <AriaTanstackLink preload={"intent"} {...props} />;
};
