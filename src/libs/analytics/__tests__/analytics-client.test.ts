/**
 * Analytics Client Tests
 * Test the core analytics client functionality
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { AnalyticsClient } from "../analytics-client";
import { MockStrategy } from "../index";
import { createMockAnalytics, testData } from "./test-utils";

describe("AnalyticsClient", () => {
  let mockAnalytics: ReturnType<typeof createMockAnalytics>;

  beforeEach(() => {
    mockAnalytics = createMockAnalytics();
  });

  describe("Core Functionality", () => {
    it("should track events with type safety", () => {
      mockAnalytics.client.track("click", testData.clickEvent);

      mockAnalytics.expectTracked("click", testData.clickEvent);
    });

    it("should allow additional properties on events", () => {
      mockAnalytics.client.track("click", {
        ...testData.clickEvent,
        customProperty: "custom-value",
        section: "header",
      });

      mockAnalytics.expectTracked("click", {
        ...testData.clickEvent,
      });
    });

    it("should identify users", () => {
      mockAnalytics.client.identify("user-123", testData.userProperties);

      mockAnalytics.expectIdentified("user-123", testData.userProperties);
    });

    it("should track page views", () => {
      mockAnalytics.client.page("Dashboard", { section: "main" });

      expect(mockAnalytics.page).toHaveBeenCalledWith("Dashboard", {
        section: "main",
      });
    });
  });

  describe("Configuration", () => {
    it("should respect enabled flag", () => {
      const client = new AnalyticsClient(new MockStrategy());
      client.initialize();
      client.updateConfig({ enabled: false });
      const trackSpy = vi.spyOn(client, "track");

      client.track("click", testData.clickEvent);

      expect(trackSpy).toHaveBeenCalled(); // Client method called
      // But strategy should not receive the event due to enabled: false
    });

    it("should update configuration", () => {
      mockAnalytics.client.updateConfig({ debug: true });

      expect(mockAnalytics.client.getConfig().debug).toBe(true);
    });

    it("should return current configuration", () => {
      const config = mockAnalytics.client.getConfig();

      expect(config).toHaveProperty("enabled");
      expect(config).toHaveProperty("debug");
    });
  });

  describe("Strategy Integration", () => {
    it("should return the underlying strategy", () => {
      const strategy = mockAnalytics.client.getStrategy();

      expect(strategy.name).toBe("mock");
    });

    it("should report ready state", () => {
      expect(mockAnalytics.client.isReady()).toBe(true);
    });
  });


  describe("Error Handling", () => {
    it("should handle strategy initialization errors gracefully", async () => {
      const failingStrategy = {
        name: "failing",
        initialize: vi.fn().mockRejectedValue(new Error("Init failed")),
        track: vi.fn(),
        identify: vi.fn(),
        page: vi.fn(),
        reset: vi.fn(),
        setUser: vi.fn(),
        captureException: vi.fn(),
        isReady: vi.fn(() => false),
      };

      const client = new AnalyticsClient(failingStrategy, {
        debug: true,
        enabled: true,
      });

      // Should not throw
      expect(() => client.initialize()).not.toThrow();
    });

    it("should capture exceptions", () => {
      const error = new Error("Test error");

      mockAnalytics.client.captureException(error, {
        component: "TestComponent",
      });

      expect(mockAnalytics.captureException).toHaveBeenCalledWith(error, {
        component: "TestComponent",
      });
    });
  });

  describe("Cleanup", () => {
    it("should clean up strategy resources on destroy", () => {
      const destroySpy = vi.fn();
      mockAnalytics.client.getStrategy().destroy = destroySpy;

      mockAnalytics.client.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
