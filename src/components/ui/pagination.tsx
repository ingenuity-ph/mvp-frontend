import type React from "react";
import { useId } from "react-aria";
import type { LinkProps } from "react-aria-components";
import { z } from "zod";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import * as pagination from "@zag-js/pagination";
import { normalizeProps, useMachine } from "@zag-js/react";
import { DEFAULT_PAGE_SIZE } from "@/libs/api/constants";
import { Button, plainButtonStyles } from "./button";
import { Strong, Text } from "./text";
import { cn } from "./utils";

export function Pagination({
  "aria-label": ariaLabel = "Page navigation",
  className,
  ...props
}: React.ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label={ariaLabel}
      {...props}
      className={cn(className, "flex gap-x-2")}
    />
  );
}

export function PaginationPrevious({
  href = null,
  className,
  children = "Previous",
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <span className={cn(className, "grow basis-0")}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        variant="plain"
        aria-label="Previous page"
      >
        <svg
          className="stroke-current"
          data-slot="icon"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.75 8H13.25M2.75 8L5.25 5.5M2.75 8L5.25 10.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {children}
      </Button>
    </span>
  );
}

export function PaginationNext({
  href = null,
  className,
  children = "Next",
}: React.PropsWithChildren<{ href?: string | null; className?: string }>) {
  return (
    <span className={cn(className, "flex grow basis-0 justify-end")}>
      <Button
        {...(href === null ? { disabled: true } : { href })}
        variant="plain"
        aria-label="Next page"
      >
        {children}
        <svg
          className="stroke-current"
          data-slot="icon"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M13.25 8L2.75 8M13.25 8L10.75 10.5M13.25 8L10.75 5.5"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
    </span>
  );
}

export function PaginationList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      {...props}
      className={cn(className, "hidden items-baseline gap-x-2 sm:flex")}
    />
  );
}

export function PaginationPage({
  href,
  className,
  current = false,
  children,
}: React.PropsWithChildren<{
  className?: string;
  current?: boolean;
}> &
  Pick<LinkProps, "href" | "routerOptions">) {
  return (
    <Button
      href={href}
      variant="plain"
      aria-label={`Page`}
      aria-current={current ? "page" : undefined}
      className={cn(
        className,
        "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
        current && "before:bg-zinc-950/5 dark:before:bg-white/10"
      )}
    >
      <span className="-mx-0.5">{children}</span>
    </Button>
  );
}

export function PaginationGap({
  className,
  children = <>&hellip;</>,
  ...props
}: React.ComponentPropsWithoutRef<"span">) {
  return (
    <span
      aria-hidden="true"
      {...props}
      className={cn(
        className,
        "w-[2.25rem] text-center text-sm/6 font-semibold text-zinc-950 select-none dark:text-white"
      )}
    >
      {children}
    </span>
  );
}

const getPageValue = (maybePage: unknown) => {
  return z
    .object({ page: z.coerce.number() })
    .catch({ page: 1 })
    .parse(maybePage);
};

export function DefaultPagination({ count }: { count?: number }) {
  const search = useSearch({ strict: false });
  const currentPage = getPageValue(search).page;
  const navigate = useNavigate();
  const service = useMachine(pagination.machine, {
    id: useId(),
    count,
    onPageChange(details) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      void navigate({ to: ".", search: { page: details.page.toString() } });
    },
    page: currentPage,
    pageSize: DEFAULT_PAGE_SIZE,
    siblingCount: 3,
  });

  const api = pagination.connect(service, normalizeProps);

  if (!count) {
    return null;
  }

  return (
    <div>
      {api.totalPages <= 1 && (
        <Text level="label-sm">
          Showing all <Strong>{api.count}</Strong> item/s
        </Text>
      )}
      {api.totalPages > 1 && (
        <nav {...api.getRootProps()}>
          <ul className="flex gap-x-2">
            <li>
              <Link
                to="."
                {...api.getPrevTriggerProps()}
                data-rac
                className={cn(
                  plainButtonStyles({ color: "neutral" }),
                  //
                  "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg disabled:opacity-50",
                  //
                  "data-selected:before:bg-zinc-950/5 dark:data-selected:before:bg-white/10"
                )}
              >
                <span className="-mx-0.5">
                  Previous <span className="sr-only">Page</span>
                </span>
              </Link>
            </li>
            {api.pages.map((page, i) => {
              if (page.type === "page") {
                return (
                  <li key={page.value}>
                    <Link
                      to="."
                      {...api.getItemProps(page)}
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      params={{ page: "2" }}
                      className={cn(
                        plainButtonStyles({ color: "neutral" }),
                        //
                        "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
                        //
                        "data-selected:before:bg-zinc-950/5 dark:data-selected:before:bg-white/10"
                      )}
                    >
                      {page.value}
                    </Link>
                  </li>
                );
              }

              return (
                // eslint-disable-next-line react/no-array-index-key
                <li key={`ellipsis-${i}`}>
                  <PaginationGap {...api.getEllipsisProps({ index: i })} />
                </li>
              );
            })}
            <li>
              <Link
                to="."
                {...api.getNextTriggerProps()}
                data-rac
                className={cn(
                  plainButtonStyles({ color: "neutral" }),
                  //
                  "min-w-[2.25rem] before:absolute before:-inset-px before:rounded-lg",
                  //
                  "data-selected:before:bg-zinc-950/5 dark:data-selected:before:bg-white/10"
                )}
              >
                <span className="-mx-0.5">
                  Next <span className="sr-only">Page</span>
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
