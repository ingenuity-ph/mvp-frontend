/**
 * Analytics Module
 * Export all public APIs
 */

// Core types and interfaces
export type * from './analytics-types'

// Strategy implementations
export { PostHogStrategy, type PostHogConfig } from './strategies/posthog-strategy'
export { ConsoleStrategy, type ConsoleConfig } from './strategies/console-strategy'
export { MockStrategy } from './strategies/mock-strategy'

// Core client
export { AnalyticsClient } from './analytics-client'

// React provider and hook
export { AnalyticsProvider, useAnalytics } from './analytics-provider'