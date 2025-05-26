import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { type LinkProps, redirect } from "@tanstack/react-router";

type RedirectTo = LinkProps["to"];
export async function requireAuth({
  redirectTo = "/login",
}: {
  redirectTo?: RedirectTo;
}) {
  try {
    await getCurrentUser();

    return await fetchAuthSession();
  } catch {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw redirect({ to: redirectTo });
  }
}
