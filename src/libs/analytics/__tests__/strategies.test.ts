/**
 * Strategy Tests
 * Test different analytics strategies
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConsoleStrategy } from "../index";
import { testData } from "./test-utils";

describe("Analytics Strategies", () => {
  describe("ConsoleStrategy", () => {
    let strategy: ConsoleStrategy;
    let consoleSpy: any;

    beforeEach(() => {
      strategy = new ConsoleStrategy();
      consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    });

    it("should initialize with default config", () => {
      strategy.initialize();

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics] Console strategy initialized"
      );
    });

    it("should initialize with custom config", () => {
      const customSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      strategy.initialize({
        prefix: "[TEST]",
        logLevel: "warn",
      });

      expect(customSpy).toHaveBeenCalledWith(
        "[TEST] Console strategy initialized"
      );
    });

    it("should log tracking events", () => {
      strategy.initialize();
      strategy.track("click", testData.clickEvent);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics] Track:",
        "click",
        testData.clickEvent
      );
    });

    it("should log user identification", () => {
      strategy.initialize();
      strategy.identify("user-123", testData.userProperties);

      expect(consoleSpy).toHaveBeenCalledWith(
        "[Analytics] Identify:",
        "user-123",
        testData.userProperties
      );
    });

    it("should be ready immediately", () => {
      expect(strategy.isReady()).toBe(true);
    });
  });

  // describe("PostHogStrategy", () => {
  //   let strategy: PostHogStrategy;
  //   let mockPH: ReturnType<typeof mockPostHog>;

  //   beforeEach(() => {
  //     mockPH = mockPostHog();
  //     strategy = new PostHogStrategy();
  //   });

  //   it("should require apiKey and apiHost for initialization", async () => {
  //     await expect(strategy.initialize({} as any)).rejects.toThrow(
  //       "PostHog requires apiKey and apiHost"
  //     );
  //   });

  //   it("should initialize PostHog with config", async () => {
  //     const config = {
  //       apiKey: "test-key",
  //       apiHost: "https://app.posthog.com",
  //       debug: true,
  //     };

  //     // Mock successful initialization
  //     mockPH.init.mockImplementation((key, options) => {
  //       if (options.loaded) {
  //         setTimeout(options.loaded, 0);
  //       }
  //     });

  //     await strategy.initialize(config);

  //     expect(mockPH.init).toHaveBeenCalledWith(config.apiKey, {
  //       api_host: config.apiHost,
  //       debug: config.debug,
  //       capture_pageview: true,
  //       capture_exceptions: true,
  //       loaded: expect.any(Function),
  //     });
  //   });

  //   it("should track events through PostHog", () => {
  //     // Setup initialized state
  //     vi.spyOn(strategy, "isReady").mockReturnValue(true);

  //     strategy.track("click", testData.clickEvent);

  //     expect(mockPH.capture).toHaveBeenCalledWith("click", testData.clickEvent);
  //   });

  //   it("should identify users through PostHog", () => {
  //     vi.spyOn(strategy, "isReady").mockReturnValue(true);

  //     strategy.identify("user-123", testData.userProperties);

  //     expect(mockPH.identify).toHaveBeenCalledWith(
  //       "user-123",
  //       testData.userProperties
  //     );
  //   });

  //   it("should handle PostHog errors gracefully", () => {
  //     vi.spyOn(strategy, "isReady").mockReturnValue(true);
  //     mockPH.capture.mockImplementation(() => {
  //       throw new Error("PostHog error");
  //     });

  //     expect(() => {
  //       strategy.track("click", testData.clickEvent);
  //     }).not.toThrow();
  //   });

  //   it("should not track when not ready", () => {
  //     vi.spyOn(strategy, "isReady").mockReturnValue(false);

  //     strategy.track("click", testData.clickEvent);

  //     expect(mockPH.capture).not.toHaveBeenCalled();
  //   });
  // });
});
