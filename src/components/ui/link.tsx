import type * as React from "react";
import { Link as AriaLink } from "react-aria-components";
import { createLink, type LinkComponent } from "@tanstack/react-router";

export const AriaTanstackLink = createLink(AriaLink);

export type LinkProps = React.ComponentProps<
  LinkComponent<typeof AriaTanstackLink>
>;

// eslint-disable-next-line react/function-component-definition
export const Link: LinkComponent<typeof AriaTanstackLink> = (props) => {
  return <AriaTanstackLink preload={"intent"} {...props} />;
};
