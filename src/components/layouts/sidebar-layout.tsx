/* eslint-disable @typescript-eslint/no-shadow */
import { type ComponentPropsWithoutRef, useState } from "react";
import { ListIcon } from "@phosphor-icons/react";
import { Drawer } from "../ui/drawer";
import { NavbarItem } from "../ui/navbar";
import { cn } from "../ui/utils";

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Drawer
      isOpen={open}
      position="left"
      onOpenChange={(open) => {
        if (!open) {
          close();
        }
      }}
    >
      {children}
    </Drawer>
  );
}

export function SidebarLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-neutral-100 dark:bg-neutral-900 dark:lg:bg-neutral-950">
      {/* Sidebar on desktop */}
      <div className="fixed inset-y-0 left-0 w-64 max-lg:hidden">{sidebar}</div>
      {/* Sidebar on mobile */}
      <span className="lg:hidden">
        <MobileSidebar
          open={isSidebarOpen}
          close={() => {
            setIsSidebarOpen(false);
          }}
        >
          {sidebar}
        </MobileSidebar>
      </span>

      {/* Navbar on mobile */}
      <header className="flex items-center px-4 lg:hidden">
        <div className="py-2.5">
          <NavbarItem
            aria-label="Open navigation"
            onClick={() => {
              setIsSidebarOpen(true);
            }}
          >
            <ListIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col lg:min-w-0 lg:pl-64">
        {children}
      </main>
    </div>
  );
}

export function SidebarLayoutContent({
  children,
  className,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      {...props}
      className={cn([
        // Base
        "grow lg:bg-white lg:ring-1 lg:ring-neutral-950/5 dark:lg:bg-neutral-900 dark:lg:ring-white/10",
        //
        className,
      ])}
    >
      {children}
    </div>
  );
}
