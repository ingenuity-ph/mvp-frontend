import { getCurrentUser } from "aws-amplify/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginFlowForm } from "@/features/auth/cognito/auth-flow/LoginFlowForm";

/**
 * TODO:
 * []-Handle use-case where sign in confirmation is outside app (e.g. Cognito send an email to user tha confirms their sign in).
 */
export const Route = createFileRoute("/(unauthenticated)/login")({
  component: App,
  async loader() {
    try {
      await getCurrentUser();

      return redirect({ to: "/home" });
    } catch {
      //
    }
  },
});

function App() {
  return <LoginFlowForm />;
}
