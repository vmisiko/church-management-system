/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PaymentEventProperties } from '../domain/AnalyticsEvents'

// Define the rudderanalytics global type
declare global {
  interface Window {
    rudderanalytics: {
      identify: (userId: string, traits: any) => void
      track: (event: string, properties: any) => void
      page: (category?: string, name?: string, properties?: any) => void
      reset: () => void
      load: (writeKey: string, dataPlaneUrl: string, options?: any) => void
      ready: (callback: () => void) => void
    }
  }
}

export class Analytics {
  private static instance: Analytics

  private constructor() {
    // RudderStack is already initialized via the script tag
    // No need to initialize it again here
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics()
    }
    return Analytics.instance
  }

  /**
   * Identifies a user with an email address and optional traits.
   * @param email - The email address of the user.
   * @param traits - Optional traits to identify the user with.
   */
  public identify(email: string, traits: PaymentEventProperties): void {
    window.rudderanalytics.identify(email, traits)
  }

  /**
   * Tracks an event with optional properties.
   * @param event - The event name to track.
   * @param properties - Optional properties to include with the event.
   */
  public track(event: string, properties: PaymentEventProperties): void {
    window.rudderanalytics.track(event, properties)
  }

  /**
   * Tracks a page view with optional category, name and properties.
   * @param category - Optional category of the page.
   * @param name - Optional name of the page.
   * @param properties - Optional properties to include with the page view.
   */
  public page(category?: string, name?: string, properties?: PaymentEventProperties): void {
    window.rudderanalytics.page(category, name, properties)
  }

  /**
   * Resets the user identity.
   */
  public reset(): void {
    window.rudderanalytics.reset()
  }
}
