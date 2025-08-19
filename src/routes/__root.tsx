import "@fontsource/inter/300.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import { RouterProvider } from "react-aria-components";
import { IconContext } from "@phosphor-icons/react";
import {
  createRootRoute,
  type NavigateOptions,
  Outlet,
  type ToOptions,
  useRouter,
} from "@tanstack/react-router";
// import { AreyouSure } from "~/libs/callable";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toast } from "@/components/ui/toast";
import { QueryProvider, queryClient } from "@/libs/query/query-client";

declare module "react-aria-components" {
  interface RouterConfig {
    href: ToOptions["to"];
    routerOptions: Omit<NavigateOptions, "to">;
  }
}
export const Route = createRootRoute({
  context: () => ({
    queryClient,
  }),
  component: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const router = useRouter();

    return (
      <QueryProvider>
        <IconContext
          value={{
            // @ts-expect-error
            "data-slot": "icon",
          }}
        >
          <RouterProvider
            useHref={(to) => router.buildLocation({ to }).href}
            navigate={(to, options) => router.navigate({ to, ...options })}
          >
            <Outlet />
            <Toast />
            {/* <AreyouSure.Root /> */}
            <TanStackRouterDevtools />
          </RouterProvider>
        </IconContext>
      </QueryProvider>
    );
  },
});
