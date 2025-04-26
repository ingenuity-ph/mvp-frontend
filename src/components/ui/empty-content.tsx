import type React from "react";
import { Empty } from "@phosphor-icons/react";

export function EmptyContent({
  label,
  description,
}: {
  label: string;
  description: React.ReactNode;
}) {
  return (
    <div
      className="flex h-60 flex-col items-center justify-center gap-y-4 text-zinc-700"
      data-testid="empty-document-state"
    >
      <Empty className="h-12 w-12" />

      <div className="text-center">
        <h3 className="text-lg font-semibold">{label}</h3>

        <p className="mt-2 max-w-[60ch]">{description}</p>
      </div>
    </div>
  );
}
