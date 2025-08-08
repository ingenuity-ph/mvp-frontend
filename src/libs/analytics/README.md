# Analytics Module

A flexible, type-safe analytics system using the Strategy pattern. Supports multiple providers (PostHog, Console, Mock) with a unified API.

## Architecture

- **Strategy Pattern**: Different analytics providers (PostHog, Console, Mock)
- **Plugin System**: Extensible event processing
- **Type Safety**: Full TypeScript support with typed events
- **Simple API**: Clean developer experience

### Event Naming Best Practices

The analytics system guides you to use PostHog's recommended format:

```typescript
// ✅ Good examples (PostHog [object] [verb] format):
analytics.track("user signed up", { method: "email" });
analytics.track("project created", { template: "react" });
analytics.track("button clicked", { location: "header" });
analytics.track("file uploaded", { type: "image", size_mb: 1.2 });

// ❌ Avoid these patterns:
analytics.track("click"); // Missing object
analytics.track("signup"); // Use 'user signed up'
analytics.track("button_clicked"); // Use spaces, not underscores
```

### Advanced: Type Safety (Optional)

Teams can add type safety through module augmentation:

```typescript
// In your types file
declare module "@/libs/analytics" {
  interface AnalyticsEventMap {
    "user signed up": {
      method: "email" | "google" | "github";
      source?: "homepage" | "pricing";
    };
    "project created": {
      template: "react" | "vue";
      visibility: "public" | "private";
    };
  }
}

// Now you get autocomplete and validation
analytics.track("user signed up", { method: "email" });
```

## Quick Start

### 1. Basic Setup

```tsx
import {
  createAnalytics,
  AnalyticsProvider,
  PostHogStrategy,
} from "@/libs/analytics";

// Create analytics client
const analyticsClient = createAnalytics(
  PostHogStrategy,
  {
    apiKey: "your-posthog-key",
    apiHost: "https://app.posthog.com",
    debug: true,
  },
  {
    enabled: true,
    debug: process.env.NODE_ENV === "development",
  }
);

// Wrap your app
function App() {
  return (
    <AnalyticsProvider client={analyticsClient}>
      <YourApp />
    </AnalyticsProvider>
  );
}
```

### 2. Using Analytics in Components

```tsx
import { useAnalytics } from "@/libs/analytics";

function MyComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.track("click", {
      element: "button",
      label: "Sign Up",
      // Add any additional verbose properties
      section: "hero",
      variant: "primary",
    });
  };

  return <button onClick={handleClick}>Sign Up</button>;
}
```

### 3. Different Strategies

#### PostHog (Production)

```tsx
const client = createAnalytics(PostHogStrategy, {
  apiKey: "phc_your_key",
  apiHost: "https://app.posthog.com",
  capturePageViews: true,
  captureExceptions: true,
});
```

#### Console (Development)

```tsx
const client = createAnalytics(ConsoleStrategy, {
  prefix: "[MyApp Analytics]",
  logLevel: "info",
});
```

#### Mock (Testing)

```tsx
const client = createAnalytics(MockStrategy);
```

## Event Types

The system supports these simplified event types:

```tsx
// Simple, concise events
analytics.track("click", { element: "button", label: "Save" });
analytics.track("submit", { form: "contact", success: true });
analytics.track("view", { page: "dashboard" });
analytics.track("navigate", { to: "/settings", from: "/profile" });
analytics.track("error", { message: "API failed", source: "auth" });
analytics.track("performance", { metric: "LCP", value: 2500 });

// Custom events for specific business logic
analytics.track("custom", {
  action: "feature_used",
  feature: "dark_mode",
  context: { user_type: "premium" },
});
```

## Component Integration

Add tracking data attributes to components following the component API standards:

```tsx
<Button
  data-track="click"
  data-track-props={{
    element: "button",
    label: "Delete Account",
    severity: "high",
  }}
>
  Delete Account
</Button>
```

## Environment-Specific Setup

```tsx
// utils/analytics.ts
import {
  createAnalytics,
  PostHogStrategy,
  ConsoleStrategy,
  MockStrategy,
} from "@/libs/analytics";

export function createAppAnalytics() {
  if (import.meta.env.MODE === "test") {
    return createAnalytics(MockStrategy);
  }

  if (import.meta.env.MODE === "development") {
    return createAnalytics(ConsoleStrategy, {
      prefix: "[Dev Analytics]",
    });
  }

  return createAnalytics(PostHogStrategy, {
    apiKey: import.meta.env.VITE_PUBLIC_POSTHOG_KEY!,
    apiHost: import.meta.env.VITE_PUBLIC_POSTHOG_HOST!,
  });
}

// In your app root
const analyticsClient = createAppAnalytics();
```

## Testing

```tsx
import { createAnalytics, MockStrategy } from "@/libs/analytics";
import { vi } from "vitest";

// Create mock analytics for testing
const mockAnalytics = createAnalytics(MockStrategy);

// Test component with analytics
test("button tracks click event", () => {
  const trackSpy = vi.spyOn(mockAnalytics, "track");

  render(
    <AnalyticsProvider client={mockAnalytics}>
      <MyButton />
    </AnalyticsProvider>
  );

  fireEvent.click(screen.getByRole("button"));

  expect(trackSpy).toHaveBeenCalledWith("click", {
    element: "button",
    label: expect.any(String),
  });
});
```
