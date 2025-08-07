/**
 * Analytics Types and Interfaces
 * Simplified, practical event tracking with optional verbosity
 */

export interface TrackingEvents {
  // User interactions
  click: {
    element: string; // 'button', 'link', 'card', etc.
    label?: string;
  };

  submit: {
    form: string;
    success: boolean;
  };

  view: {
    page: string;
  };

  navigate: {
    to: string;
    from?: string;
  };

  // System events
  error: {
    message: string;
    source?: string;
  };

  performance: {
    metric: string;
    value: number;
  };

  // Custom events - for specific business logic
  custom: {
    action: string;
    [key: string]: any;
  };
}

export interface UserProperties {
  user_id?: string;
  email?: string;
  [key: string]: any;
}

// Strategy Pattern: Analytics Provider Interface
export interface AnalyticsStrategy {
  readonly name: string;
  initialize(config: Record<string, any>): Promise<void> | void;
  track<T extends keyof TrackingEvents>(
    event: T,
    properties: TrackingEvents[T] & Record<string, any>
  ): void;
  identify(userId: string, properties?: UserProperties): void;
  page(name?: string, properties?: Record<string, any>): void;
  reset(): void;
  setUser(properties: UserProperties): void;
  captureException(error: Error, context?: Record<string, any>): void;
  isReady(): boolean;
  destroy?(): void;
}

// Main Analytics Client Interface
export interface AnalyticsClient {
  // Core tracking methods
  track<T extends keyof TrackingEvents>(
    event: T,
    properties: TrackingEvents[T] & Record<string, any> // Allow additional verbose properties
  ): void;
  identify(userId: string, properties?: UserProperties): void;
  page(name?: string, properties?: Record<string, any>): void;
  reset(): void;
  setUser(properties: UserProperties): void;
  captureException(error: Error, context?: Record<string, any>): void;

  // Configuration
  updateConfig(config: Partial<AnalyticsConfig>): void;
  getConfig(): AnalyticsConfig;

  // State
  isReady(): boolean;
  getStrategy(): AnalyticsStrategy;
}

// Generic Configuration
export interface AnalyticsConfig {
  enabled: boolean;
  debug: boolean;
}

// Context Value
export type AnalyticsContextValue = AnalyticsClient;
