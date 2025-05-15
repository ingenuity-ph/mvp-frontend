import { createFileRoute, redirect } from "@tanstack/react-router";
import { requireAuth } from "@/features/auth/utils/requireAuth";

export const Route = createFileRoute("/")({
  loader: async () => {
    await requireAuth({ redirectTo: "/login" });

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/home" });
  },
});
