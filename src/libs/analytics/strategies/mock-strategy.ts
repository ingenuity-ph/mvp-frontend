/**
 * Mock Analytics Strategy
 * No-op implementation for testing or when analytics is disabled
 */

import type { AnalyticsStrategy, TrackingEvents } from "../analytics-types";

export class MockStrategy implements AnalyticsStrategy {
  readonly name = "mock";

  initialize(): void {
    // No-op
  }

  track<T extends keyof TrackingEvents>(): void {
    // No-op
  }

  identify(): void {
    // No-op
  }

  page(): void {
    // No-op
  }

  reset(): void {
    // No-op
  }

  setUser(): void {
    // No-op
  }

  captureException(): void {
    // No-op
  }

  isReady(): boolean {
    return true;
  }
}
