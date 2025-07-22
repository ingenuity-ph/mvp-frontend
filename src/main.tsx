import "./styles.css";
// Import PostHog React provider
import { PostHogProvider } from "posthog-js/react";
import { StrictMode } from "react";
// eslint-disable-next-line @typescript-eslint/naming-convention
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { env } from "./env.ts";
import { queryClient } from "./libs/query/query-client.tsx";
import reportWebVitals from "./reportWebVitals.ts";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.querySelector("#app");

if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <StrictMode>
      <PostHogProvider
        apiKey={env.VITE_PUBLIC_POSTHOG_KEY}
        options={{
          api_host: env.VITE_PUBLIC_POSTHOG_HOST,
          capture_exceptions: true, // This enables capturing exceptions using Error Tracking
          debug: import.meta.env.MODE === "development",
          enable_recording_console_log: true,
        }}
      >
        <RouterProvider router={router} />
      </PostHogProvider>
    </StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
