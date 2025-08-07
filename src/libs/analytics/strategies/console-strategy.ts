/**
 * Console Analytics Strategy
 * Logs analytics events to browser console - perfect for development
 */

import type { AnalyticsStrategy, TrackingEvents, UserProperties } from '../analytics-types'

export interface ConsoleConfig {
  prefix?: string
  logLevel?: 'log' | 'info' | 'warn'
}

export class ConsoleStrategy implements AnalyticsStrategy {
  readonly name = 'console'
  private prefix: string = '[Analytics]'
  private logLevel: 'log' | 'info' | 'warn' = 'info'

  initialize(config: ConsoleConfig = {}): void {
    this.prefix = config.prefix || '[Analytics]'
    this.logLevel = config.logLevel || 'info'
    
    console[this.logLevel](`${this.prefix} Console strategy initialized`)
  }

  track<T extends keyof TrackingEvents>(
    event: T, 
    properties: TrackingEvents[T] & Record<string, any>
  ): void {
    console[this.logLevel](`${this.prefix} Track:`, event, properties)
  }

  identify(userId: string, properties?: UserProperties): void {
    console[this.logLevel](`${this.prefix} Identify:`, userId, properties)
  }

  page(name?: string, properties?: Record<string, any>): void {
    console[this.logLevel](`${this.prefix} Page:`, name || 'Unknown', properties)
  }

  reset(): void {
    console[this.logLevel](`${this.prefix} Reset session`)
  }

  setUser(properties: UserProperties): void {
    console[this.logLevel](`${this.prefix} Set User:`, properties)
  }

  captureException(error: Error, context?: Record<string, any>): void {
    console.error(`${this.prefix} Exception:`, error.message, context)
  }

  isReady(): boolean {
    return true // Console is always ready
  }
}