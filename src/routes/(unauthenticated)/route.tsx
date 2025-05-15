import { Amplify } from "aws-amplify";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { env } from "@/env";

export const Route = createFileRoute("/(unauthenticated)")({
  component: RouteComponent,
});

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: env.VITE_COGNITO_CLIENT_ID,
      userPoolId: env.VITE_COGNITO_POOL_ID,
      loginWith: {
        email: true,
      },
    },
  },
});

function RouteComponent() {
  return <Outlet />;
}
