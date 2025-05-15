import { signOut } from "aws-amplify/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/logout")({
  async loader() {
    await signOut({ global: true });
    throw redirect({ to: "/login" });
  },
});
