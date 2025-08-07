/**
 * Test utilities for analytics module
 * Provides mocks, spies, and helpers for testing analytics functionality
 */

import { vi, beforeEach, expect, type MockedFunction } from "vitest";
import { AnalyticsClient } from "../analytics-client";
import { MockStrategy, ConsoleStrategy } from "../index";
import type {
  TrackingEvents,
  UserProperties,
} from "../analytics-types";

/**
 * Create a mock analytics client with spied methods
 */
export function createMockAnalytics() {
  const client = new AnalyticsClient(new MockStrategy());
  client.initialize();

  // Spy on all tracking methods
  const spies = {
    track: vi.spyOn(client, "track"),
    identify: vi.spyOn(client, "identify"),
    page: vi.spyOn(client, "page"),
    setUser: vi.spyOn(client, "setUser"),
    captureException: vi.spyOn(client, "captureException"),
    reset: vi.spyOn(client, "reset"),
  };

  return {
    client,
    ...spies,
    // Convenience methods for assertions
    expectTracked: <T extends keyof TrackingEvents>(
      event: T,
      properties?: Partial<TrackingEvents[T]>
    ) => {
      expect(spies.track).toHaveBeenCalledWith(
        event,
        properties ? expect.objectContaining(properties) : expect.any(Object)
      );
    },
    expectNotTracked: () => {
      expect(spies.track).not.toHaveBeenCalled();
    },
    expectIdentified: (
      userId: string,
      properties?: Partial<UserProperties>
    ) => {
      expect(spies.identify).toHaveBeenCalledWith(
        userId,
        properties ? expect.objectContaining(properties) : expect.any(Object)
      );
    },
    clearMocks: () => {
      Object.values(spies).forEach((spy) => spy.mockClear());
    },
  };
}

/**
 * Create a console analytics client for debugging tests
 */
export function createTestConsoleAnalytics() {
  const client = new AnalyticsClient(new ConsoleStrategy());
  client.initialize();
  return client;
}

/**
 * Mock PostHog for integration tests
 */
export function mockPostHog() {
  const mockPostHog = {
    init: vi.fn(),
    capture: vi.fn(),
    identify: vi.fn(),
    people: {
      set: vi.fn(),
    },
    reset: vi.fn(),
    captureException: vi.fn(),
  };

  // Mock the posthog-js module
  vi.doMock("posthog-js", () => ({
    posthog: mockPostHog,
  }));

  return mockPostHog;
}

/**
 * Test data factories
 */
export const testData = {
  clickEvent: {
    element: "button",
    label: "Test Button",
  },
  submitEvent: {
    form: "test-form",
    success: true,
  },
  userProperties: {
    user_id: "test-user-123",
    email: "test@example.com",
  },
};

/**
 * Custom matchers for analytics testing
 */
export const analyticsMatchers = {
  toHaveTrackedEvent: (
    client: AnalyticsClient,
    event: keyof TrackingEvents,
    properties?: Record<string, any>
  ) => {
    const spy = vi.spyOn(client, "track");
    const calls = spy.mock.calls;

    const found = calls.find(
      ([eventName, props]) =>
        eventName === event &&
        (!properties ||
          Object.keys(properties).every(
            (key) => props[key] === properties[key]
          ))
    );

    return {
      pass: !!found,
      message: () =>
        found
          ? `Expected not to track ${event}`
          : `Expected to track ${event} with ${JSON.stringify(properties)}`,
    };
  },
};

/**
 * Setup function for analytics tests
 */
export function setupAnalyticsTest() {
  const mockAnalytics = createMockAnalytics();

  // Reset all mocks before each test
  beforeEach(() => {
    mockAnalytics.clearMocks();
  });

  return mockAnalytics;
}
