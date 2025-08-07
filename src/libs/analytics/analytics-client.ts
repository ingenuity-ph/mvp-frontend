/**
 * Main Analytics Client
 * Uses Strategy pattern for different analytics providers
 */

import type { 
  AnalyticsClient as IAnalyticsClient,
  AnalyticsStrategy, 
  AnalyticsConfig, 
  TrackingEvents, 
  UserProperties 
} from './analytics-types'

export class AnalyticsClient implements IAnalyticsClient {
  private strategy: AnalyticsStrategy
  private config: AnalyticsConfig

  constructor(strategy: AnalyticsStrategy, config: AnalyticsConfig = { enabled: true, debug: false }) {
    this.strategy = strategy
    this.config = config
  }

  /**
   * Initialize the analytics client with the strategy
   */
  async initialize(strategyConfig?: Record<string, any>): Promise<void> {
    try {
      await this.strategy.initialize(strategyConfig || {})
    } catch (error) {
      if (this.config.debug) {
        console.error('Analytics initialization failed:', error)
      }
    }
  }

  track<T extends keyof TrackingEvents>(
    event: T, 
    properties: TrackingEvents[T] & Record<string, any>
  ): void {
    if (!this.config.enabled) return
    this.strategy.track(event, properties)
  }

  identify(userId: string, properties?: UserProperties): void {
    if (!this.config.enabled) return
    this.strategy.identify(userId, properties)
  }

  page(name?: string, properties?: Record<string, any>): void {
    if (!this.config.enabled) return
    this.strategy.page(name, properties)
  }

  reset(): void {
    if (!this.config.enabled) return
    this.strategy.reset()
  }

  setUser(properties: UserProperties): void {
    if (!this.config.enabled) return
    this.strategy.setUser(properties)
  }

  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.config.enabled) return
    this.strategy.captureException(error, context)
  }


  // Configuration
  updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }

  getConfig(): AnalyticsConfig {
    return this.config
  }

  // State
  isReady(): boolean {
    return this.strategy.isReady()
  }

  getStrategy(): AnalyticsStrategy {
    return this.strategy
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    // Clean up strategy
    if (this.strategy.destroy) {
      this.strategy.destroy()
    }
  }
}