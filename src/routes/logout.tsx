import { signOut } from "aws-amplify/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient } from "@/libs/query/query-client";

export const Route = createFileRoute("/logout")({
  async loader() {
    // Add necessary cleanup logic here like clearing cookies, local storage, etc.
    await signOut({ global: true });

    // Clear the query client cache
    queryClient.clear();
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/login" });
  },
});
