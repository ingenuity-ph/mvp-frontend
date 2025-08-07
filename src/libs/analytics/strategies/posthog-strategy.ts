/**
 * PostHog Analytics Strategy
 * Handles its own configuration internally
 */

import { posthog } from 'posthog-js'
import type { AnalyticsStrategy, TrackingEvents, UserProperties } from '../analytics-types'

export interface PostHogConfig {
  apiKey: string
  apiHost: string
  debug?: boolean
  capturePageViews?: boolean
  captureExceptions?: boolean
}

export class PostHogStrategy implements AnalyticsStrategy {
  readonly name = 'posthog'
  private isInitialized = false

  async initialize(config: PostHogConfig): Promise<void> {
    if (!config.apiKey || !config.apiHost) {
      throw new Error('PostHog requires apiKey and apiHost')
    }

    return new Promise((resolve, reject) => {
      try {
        posthog.init(config.apiKey, {
          api_host: config.apiHost,
          debug: config.debug || false,
          capture_pageview: config.capturePageViews ?? true,
          capture_exceptions: config.captureExceptions ?? true,
          loaded: () => {
            this.isInitialized = true
            resolve()
          },
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  track<T extends keyof TrackingEvents>(
    event: T, 
    properties: TrackingEvents[T] & Record<string, any>
  ): void {
    if (!this.isReady()) return
    
    try {
      posthog.capture(event, properties)
    } catch (error) {
      console.error('PostHog track error:', error)
    }
  }

  identify(userId: string, properties?: UserProperties): void {
    if (!this.isReady()) return
    
    try {
      posthog.identify(userId, properties)
    } catch (error) {
      console.error('PostHog identify error:', error)
    }
  }

  page(name?: string, properties?: Record<string, any>): void {
    if (!this.isReady()) return
    
    try {
      posthog.capture('$pageview', {
        $current_url: window.location.href,
        page_name: name,
        ...properties,
      })
    } catch (error) {
      console.error('PostHog page error:', error)
    }
  }

  reset(): void {
    if (!this.isReady()) return
    
    try {
      posthog.reset()
    } catch (error) {
      console.error('PostHog reset error:', error)
    }
  }

  setUser(properties: UserProperties): void {
    if (!this.isReady()) return
    
    try {
      posthog.people.set(properties)
    } catch (error) {
      console.error('PostHog setUser error:', error)
    }
  }

  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.isReady()) return
    
    try {
      posthog.captureException(error, {
        extra: context,
      })
    } catch (captureError) {
      console.error('PostHog captureException error:', captureError)
    }
  }

  isReady(): boolean {
    return this.isInitialized && !!posthog
  }

  destroy(): void {
    if (this.isInitialized) {
      try {
        posthog.reset()
      } catch (error) {
        console.error('PostHog destroy error:', error)
      }
      this.isInitialized = false
    }
  }
}