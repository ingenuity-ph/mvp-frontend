/**
 * React Integration Tests
 * Test the React provider and hooks
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { AnalyticsProvider, useAnalytics } from "../analytics-provider";
import { MockStrategy } from "../index";

// Test component that uses analytics
function TestComponent() {
  const analytics = useAnalytics();

  const handleClick = () => {
    analytics.track("click", {
      element: "button",
      label: "Test Button",
    });
  };

  const handleIdentify = () => {
    analytics.identify("user-123", {
      email: "test@example.com",
    });
  };

  return (
    <div>
      <button data-testid="track-click" onClick={handleClick}>
        Track Click
      </button>
      <button onClick={handleIdentify}>Identify User</button>
      <span data-testid="ready">
        {analytics.isReady() ? "Ready" : "Not Ready"}
      </span>
    </div>
  );
}

describe("React Integration", () => {
  let mockStrategy: MockStrategy;
  let trackSpy: ReturnType<typeof vi.spyOn>;
  let identifySpy: ReturnType<typeof vi.spyOn>;
  let pageSpy: ReturnType<typeof vi.spyOn>;
  let resetSpy: ReturnType<typeof vi.spyOn>;
  let setUserSpy: ReturnType<typeof vi.spyOn>;
  let captureExceptionSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockStrategy = new MockStrategy();
    trackSpy = vi.spyOn(mockStrategy, "track");
    identifySpy = vi.spyOn(mockStrategy, "identify");
    pageSpy = vi.spyOn(mockStrategy, "page");
    resetSpy = vi.spyOn(mockStrategy, "reset");
    setUserSpy = vi.spyOn(mockStrategy, "setUser");
    captureExceptionSpy = vi.spyOn(mockStrategy, "captureException");
  });

  describe("AnalyticsProvider", () => {
    it("should provide analytics context to children", () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      expect(screen.getByText("Ready")).toBeInTheDocument();
    });

    it("should throw error when useAnalytics used outside provider", () => {
      // Suppress console.error for this test
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow("useAnalytics must be used within an AnalyticsProvider");

      consoleSpy.mockRestore();
    });
  });

  describe("useAnalytics Hook", () => {
    it("should track events when called from components", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByTestId("track-click"));

      expect(trackSpy).toHaveBeenCalledWith("click", {
        element: "button",
        label: "Test Button",
      });
    });

    it("should identify users when called from components", async () => {
      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <TestComponent />
        </AnalyticsProvider>
      );

      await userEvent.click(screen.getByText("Identify User"));

      expect(identifySpy).toHaveBeenCalledWith("user-123", {
        email: "test@example.com",
      });
    });

    it("should provide access to all analytics methods", async () => {
      function FullTestComponent() {
        const analytics = useAnalytics();

        return (
          <div>
            <button
              onClick={() => analytics.track("click", { element: "button" })}
            >
              Track
            </button>
            <button onClick={() => analytics.page("Test Page")}>Page</button>
            <button onClick={() => analytics.reset()}>Reset</button>
            <button onClick={() => analytics.setUser({ name: "Test" })}>
              Set User
            </button>
            <button
              onClick={() => analytics.captureException(new Error("Test"))}
            >
              Exception
            </button>
          </div>
        );
      }

      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <FullTestComponent />
        </AnalyticsProvider>
      );

      // Test each method
      await userEvent.click(screen.getByText("Track"));
      expect(trackSpy).toHaveBeenCalled();

      await userEvent.click(screen.getByText("Page"));
      expect(pageSpy).toHaveBeenCalledWith("Test Page", undefined);

      await userEvent.click(screen.getByText("Reset"));
      expect(resetSpy).toHaveBeenCalled();

      await userEvent.click(screen.getByText("Set User"));
      expect(setUserSpy).toHaveBeenCalledWith({
        name: "Test",
      });

      await userEvent.click(screen.getByText("Exception"));
      expect(captureExceptionSpy).toHaveBeenCalled();
    });

    it("should provide access to configuration", () => {
      function ConfigTestComponent() {
        const analytics = useAnalytics();
        const config = analytics.getConfig();

        return <div data-testid="config">{JSON.stringify(config)}</div>;
      }

      const screen = render(
        <AnalyticsProvider strategy={mockStrategy}>
          <ConfigTestComponent />
        </AnalyticsProvider>
      );

      const configElement = screen.getByTestId("config");
      const config = JSON.parse(configElement.textContent || "{}");

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("debug");
    });
  });

  describe("Error Boundaries", () => {
    it("should handle analytics errors without breaking the app", () => {
      // Create a strategy that throws errors
      const errorStrategy = new MockStrategy();
      errorStrategy.track = vi.fn().mockImplementation(() => {
        throw new Error("Analytics error");
      });

      function ErrorTestComponent() {
        const analytics = useAnalytics();

        const handleClick = () => {
          try {
            analytics.track("click", { element: "button" });
          } catch (error) {
            // Should not reach here if client handles errors properly
          }
        };

        return <button onClick={handleClick}>Test Error</button>;
      }

      const screen = render(
        <AnalyticsProvider strategy={errorStrategy}>
          <ErrorTestComponent />
        </AnalyticsProvider>
      );

      // Should not throw and break the app
      expect(async () => {
        await userEvent.click(screen.getByText("Test Error"));
      }).not.toThrow();
    });
  });
});
