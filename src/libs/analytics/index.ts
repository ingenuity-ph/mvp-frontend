/**
 * Analytics Module
 * Simplified, flexible analytics with progressive type safety
 */

// Core types and interfaces
export type {
  AnalyticsClient as AnalyticsClientCore,
  AnalyticsStrategy,
  AnalyticsConfig,
  AnalyticsEventMap,
  AnalyticsContextValue,
} from "./types";

// Strategy implementations
export {
  PostHogStrategy,
  type PostHogConfig,
} from "./strategies/posthog-strategy";
export {
  ConsoleStrategy,
  type ConsoleConfig,
} from "./strategies/console-strategy";

// Core client
export { AnalyticsClient } from "./analytics-client";

// React provider and hook
export { AnalyticsProvider, useAnalytics } from "./analytics-provider";
