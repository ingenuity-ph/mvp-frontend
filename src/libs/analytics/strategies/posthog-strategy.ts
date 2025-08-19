/**
 * PostHog Analytics Strategy
 * Implements PostHog-specific optimizations while maintaining simple API
 */

import { posthog } from "posthog-js";
import type { AnalyticsStrategy } from "../types";
import { env } from "@/env";

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
    const posthogKey = env.VITE_PUBLIC_POSTHOG_KEY;
    if (!posthogKey || !env.VITE_PUBLIC_POSTHOG_HOST) {
      throw new Error("PostHog requires apiKey and apiHost");
    }
    return new Promise((resolve, reject) => {
      try {
        posthog.init(posthogKey, {
          api_host: env.VITE_PUBLIC_POSTHOG_HOST,
          debug: config.debug ?? import.meta.env.MODE === "development",
          capture_pageview: config.capturePageViews ?? true,
          capture_exceptions: config.captureExceptions ?? true, // This enables capturing exceptions using Error Tracking
          enable_recording_console_log: true,
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
