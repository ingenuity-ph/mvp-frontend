import { useCallback, useEffect, useRef, useState } from "react";
import { useResizeObserver } from "@react-aria/utils";
import { Drawer } from "../ui/drawer";
import { NavbarItem } from "../ui/navbar";
import { SurfaceOverflow } from "../ui/surface";

const useElementDimensions = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setContentSize(
      contentRef.current?.getBoundingClientRect() ?? { width: 0, height: 0 }
    );
  }, []);

  const onResize = useCallback(() => {
    if (contentRef.current) {
      setContentSize(contentRef.current.getBoundingClientRect());
    }
  }, [contentRef]);

  useResizeObserver({
    ref: contentRef,
    onResize,
  });

  return { dimensions: contentSize, elementRef: contentRef };
};

function OpenMenuIcon() {
  return (
    <svg data-slot="icon" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 6.75C2 6.33579 2.33579 6 2.75 6H17.25C17.6642 6 18 6.33579 18 6.75C18 7.16421 17.6642 7.5 17.25 7.5H2.75C2.33579 7.5 2 7.16421 2 6.75ZM2 13.25C2 12.8358 2.33579 12.5 2.75 12.5H17.25C17.6642 12.5 18 12.8358 18 13.25C18 13.6642 17.6642 14 17.25 14H2.75C2.33579 14 2 13.6642 2 13.25Z" />
    </svg>
  );
}

function MobileSidebar({
  open,
  close,
  children,
}: React.PropsWithChildren<{ open: boolean; close: () => void }>) {
  return (
    <Drawer
      isOpen={open}
      position="left"
      inset={["left", "top", "bottom"]}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          close();
        }
      }}
    >
      <SurfaceOverflow inset="all" offset="none">
        {children}
      </SurfaceOverflow>
    </Drawer>
  );
}

export function StackedLayout({
  navbar,
  sidebar,
  children,
}: React.PropsWithChildren<{
  navbar: React.ReactNode;
  sidebar: React.ReactNode;
}>) {
  const [shouldShowSidebar, setShouldShowSidebar] = useState(false);
  const { dimensions, elementRef } = useElementDimensions();

  return (
    <div
      ref={elementRef}
      className="relative isolate flex w-full flex-col bg-white md:h-screen dark:bg-zinc-900 dark:lg:bg-zinc-950"
    >
      {/* Sidebar on mobile */}
      <MobileSidebar
        open={shouldShowSidebar}
        close={() => {
          setShouldShowSidebar(false);
        }}
      >
        {sidebar}
      </MobileSidebar>

      {/* Navbar */}
      <header className="flex items-center px-4">
        <div className="py-2.5 md:hidden">
          <NavbarItem
            aria-label="Open navigation"
            onPress={() => {
              setShouldShowSidebar(true);
            }}
          >
            <OpenMenuIcon />
          </NavbarItem>
        </div>
        <div className="min-w-0 flex-1">{navbar}</div>
      </header>

      {/* Content */}
      {/* <Divider inset="none" /> */}
      <main className="flex flex-1 flex-col">
        <div
          className="relative flex grow flex-col p-6 lg:bg-white lg:p-7 lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10"
          style={{
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            "--available-content-height":
              // FIXME: Technically, 58 should not be hardcoded and be a computation along with the dimensions
              // 56 is for vertical padding
              `${dimensions.height - 58 - 56}px`,
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
