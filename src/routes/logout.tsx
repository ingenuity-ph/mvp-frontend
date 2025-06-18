import { signOut } from "aws-amplify/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
  async loader() {
    await signOut({ global: true });
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: "/login" });
  },
});
