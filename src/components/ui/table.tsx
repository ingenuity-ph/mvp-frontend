/* eslint-disable @typescript-eslint/naming-convention */
import { clsx } from "clsx";
import { createContext, useContext, useState } from "react";
import { Link, type LinkProps } from "react-aria-components";

const TableContext = createContext<{
  bleed: boolean;
  dense: boolean;
  grid: boolean;
  striped: boolean;
}>({
  bleed: false,
  dense: false,
  grid: false,
  striped: false,
});

export function Table({
  bleed = false,
  dense = false,
  grid = false,
  striped = false,
  className,
  children,
  ...props
}: {
  bleed?: boolean;
  dense?: boolean;
  grid?: boolean;
  striped?: boolean;
} & React.ComponentPropsWithoutRef<"div">) {
  return (
    <TableContext.Provider
      value={
        { bleed, dense, grid, striped } as React.ContextType<
          typeof TableContext
        >
      }
    >
      <div className="flow-root">
        <div
          {...props}
          className={clsx(
            className,
            // overflow-x-auto
            "-mx-[--gutter] whitespace-nowrap"
          )}
        >
          <div
            className={clsx(
              "inline-block min-w-full align-middle",
              !bleed && "sm:px-[--gutter]"
            )}
          >
            <table className="min-w-full text-left text-sm/6 text-neutral-950 dark:text-white">
              {children}
            </table>
          </div>
        </div>
      </div>
    </TableContext.Provider>
  );
}

export function TableHead({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"thead">) {
  return (
    <thead
      {...props}
      className={clsx(className, "text-neutral-500 dark:text-neutral-400")}
    />
  );
}

export function TableBody(props: React.ComponentPropsWithoutRef<"tbody">) {
  return <tbody {...props} />;
}

const TableRowContext = createContext<
  {
    target?: string;
    title?: string;
  } & Pick<LinkProps, "href" | "routerOptions">
>({
  href: undefined,
  target: undefined,
  title: undefined,
});

export function TableRow({
  href,
  routerOptions,
  target,
  title,
  className,
  ...props
}: {
  target?: string;
  title?: string;
} & Pick<LinkProps, "href" | "routerOptions"> &
  React.ComponentPropsWithoutRef<"tr">) {
  const { striped } = useContext(TableContext);

  return (
    <TableRowContext.Provider
      value={
        { href, routerOptions, target, title } as React.ContextType<
          typeof TableRowContext
        >
      }
    >
      <tr
        {...props}
        className={clsx(
          className,
          "group/row",
          href &&
            "has-[[data-row-link][data-focus]]:outline-2 has-[[data-row-link][data-focus]]:-outline-offset-2 has-[[data-row-link][data-focus]]:outline-blue-500 dark:focus-within:bg-white/[2.5%]",
          striped && "even:bg-neutral-950/[2.5%] dark:even:bg-white/[2.5%]",
          href && striped && "hover:bg-neutral-950/5 dark:hover:bg-white/5",
          href &&
            !striped &&
            "hover:bg-neutral-950/[2.5%] dark:hover:bg-white/[2.5%]"
        )}
      />
    </TableRowContext.Provider>
  );
}

export function TableHeader({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"th">) {
  const { bleed, grid } = useContext(TableContext);

  return (
    <th
      {...props}
      className={clsx(
        className,
        //
        "sticky top-0 z-10 bg-white",
        //
        "border-b border-b-neutral-950/10 px-4 py-2 font-medium first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))] dark:border-b-white/10",
        grid &&
          "border-l border-l-neutral-950/5 first:border-l-0 dark:border-l-white/5",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      )}
    />
  );
}

export function TableCell({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"td">) {
  const { bleed, dense, grid, striped } = useContext(TableContext);
  const { href, routerOptions, target, title } = useContext(TableRowContext);
  const [cellRef, setCellRef] = useState<HTMLElement | null>(null);

  return (
    <td
      ref={href ? setCellRef : undefined}
      {...props}
      data-navigatable={href || undefined}
      className={clsx(
        className,
        "group/cell relative px-4 first:pl-[var(--gutter,theme(spacing.2))] last:pr-[var(--gutter,theme(spacing.2))]",
        !striped && "border-b border-neutral-950/5 dark:border-white/5",
        grid &&
          "border-l border-l-neutral-950/5 first:border-l-0 dark:border-l-white/5",
        dense ? "py-2.5" : "py-4",
        !bleed && "sm:first:pl-1 sm:last:pr-1"
      )}
    >
      {href && (
        <Link
          data-row-link
          href={href}
          target={target}
          aria-label={title}
          routerOptions={routerOptions}
          // @ts-expect-error
          tabIndex={cellRef?.previousElementSibling === null ? 0 : -1}
          className="absolute inset-0 focus:outline-none"
        />
      )}
      {children}
    </td>
  );
}
