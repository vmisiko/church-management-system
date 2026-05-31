import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Analytics } from '../Analytics'
import type { PaymentEventProperties } from '../../domain/AnalyticsEvents'

describe('Analytics', () => {
  const mockRudderAnalytics = {
    identify: vi.fn(),
    track: vi.fn(),
    page: vi.fn(),
    reset: vi.fn(),
    load: vi.fn(),
    ready: vi.fn(),
  }

  beforeEach(() => {
    // Mock the global rudderanalytics object
    window.rudderanalytics = mockRudderAnalytics
    // Reset all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Clean up after each test
    vi.resetAllMocks()
  })

  describe('getInstance', () => {
    it('should return the same instance on multiple calls', () => {
      const instance1 = Analytics.getInstance()
      const instance2 = Analytics.getInstance()
      expect(instance1).toBe(instance2)
    })
  })

  describe('identify', () => {
    it('should call rudderanalytics.identify with correct parameters', () => {
      const analytics = Analytics.getInstance()
      const email = 'test@example.com'
      const traits: PaymentEventProperties = {
        merchantId: '123',
        merchantName: 'Test Merchant',
      }

      analytics.identify(email, traits)

      expect(mockRudderAnalytics.identify).toHaveBeenCalledWith(email, traits)
      expect(mockRudderAnalytics.identify).toHaveBeenCalledTimes(1)
    })
  })

  describe('track', () => {
    it('should call rudderanalytics.track with correct parameters', () => {
      const analytics = Analytics.getInstance()
      const event = 'test_event'
      const properties: PaymentEventProperties = {
        merchantId: '123',
        merchantName: 'Test Merchant',
      }

      analytics.track(event, properties)

      expect(mockRudderAnalytics.track).toHaveBeenCalledWith(event, properties)
      expect(mockRudderAnalytics.track).toHaveBeenCalledTimes(1)
    })
  })

  describe('page', () => {
    it('should call rudderanalytics.page with all parameters', () => {
      const analytics = Analytics.getInstance()
      const category = 'test_category'
      const name = 'test_page'
      const properties: PaymentEventProperties = {
        merchantId: '123',
        merchantName: 'Test Merchant',
      }

      analytics.page(category, name, properties)

      expect(mockRudderAnalytics.page).toHaveBeenCalledWith(category, name, properties)
      expect(mockRudderAnalytics.page).toHaveBeenCalledTimes(1)
    })

    it('should call rudderanalytics.page with optional parameters', () => {
      const analytics = Analytics.getInstance()

      analytics.page()

      expect(mockRudderAnalytics.page).toHaveBeenCalledWith(undefined, undefined, undefined)
      expect(mockRudderAnalytics.page).toHaveBeenCalledTimes(1)
    })
  })

  describe('reset', () => {
    it('should call rudderanalytics.reset', () => {
      const analytics = Analytics.getInstance()

      analytics.reset()

      expect(mockRudderAnalytics.reset).toHaveBeenCalledTimes(1)
    })
  })
})
