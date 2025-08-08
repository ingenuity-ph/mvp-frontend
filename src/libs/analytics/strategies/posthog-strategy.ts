/**
 * PostHog Analytics Strategy
 * Implements PostHog-specific optimizations while maintaining simple API
 */

import { posthog } from "posthog-js";
import type { AnalyticsStrategy } from "../types";

export interface PostHogConfig {
  apiKey: string;
  apiHost: string;
  debug?: boolean;
  capturePageViews?: boolean;
  captureExceptions?: boolean;
}

export class PostHogStrategy implements AnalyticsStrategy {
  readonly name = "posthog";
  private isInitialized = false;

  async initialize(config: PostHogConfig): Promise<void> {
    if (!config.apiKey || !config.apiHost) {
      throw new Error("PostHog requires apiKey and apiHost");
    }

    return new Promise((resolve, reject) => {
      try {
        posthog.init(config.apiKey, {
          api_host: config.apiHost,
          debug: config.debug || false,
          capture_pageview: config.capturePageViews ?? true,
          capture_exceptions: config.captureExceptions ?? true,
          loaded: () => {
            this.isInitialized = true;
            resolve();
          },
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  track(event: string, properties?: Record<string, any>): void {
    if (!this.isReady()) return;

    try {
      // PostHog optimization: handle special events
      if (event === "page viewed" || event === "pageview") {
        // Use PostHog's optimized $pageview event with automatic properties
        posthog.capture("$pageview", properties);
        return;
      }

      // Regular event tracking
      posthog.capture(event, properties);
    } catch (error) {
      console.error("PostHog track error:", error);
    }
  }

  identify(userId: string, properties?: Record<string, any>): void {
    if (!this.isReady()) return;

    try {
      posthog.identify(userId, properties);
    } catch (error) {
      console.error("PostHog identify error:", error);
    }
  }

  clearIdentity(): void {
    if (!this.isReady()) return;

    try {
      posthog.reset();
    } catch (error) {
      console.error("PostHog clearIdentity error:", error);
    }
  }

  isReady(): boolean {
    return this.isInitialized && !!posthog;
  }

  cleanup(): void {
    if (this.isInitialized) {
      try {
        posthog.reset();
      } catch (error) {
        console.error("PostHog cleanup error:", error);
      }
      this.isInitialized = false;
    }
  }
}
