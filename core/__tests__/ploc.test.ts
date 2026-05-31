import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Ploc } from '../ploc'
import type { DataError, NetworkError, ValidationError } from '../domain/DataError'
import type { Analytics } from '../utility/Analytics'

// Mock store type for testing
interface TestStore {
  value: string
}

describe('Ploc', () => {
  // Create mock analytics
  const mockAnalytics: Analytics = {
    identify: vi.fn(),
    track: vi.fn(),
    page: vi.fn(),
    reset: vi.fn(),
  }

  // Create test store
  const testStore: TestStore = {
    value: 'test',
  }

  describe('constructor', () => {
    it('should initialize with store and analytics', () => {
      const ploc = new Ploc<TestStore>({
        store: testStore,
        analytics: mockAnalytics,
      })

      expect(ploc.store).toBe(testStore)
      expect(ploc.analytics).toBe(mockAnalytics)
    })
  })

  describe('handleErrors', () => {
    let ploc: Ploc<TestStore>

    beforeEach(() => {
      ploc = new Ploc<TestStore>({
        store: testStore,
        analytics: mockAnalytics,
      })
    })

    it('should handle single error', () => {
      const error: NetworkError = {
        kind: 'NetworkError',
        message: 'Network error occurred',
        timestamp: new Date(),
        source: 'test',
        statusCode: 500,
      }

      const result = ploc.handleErrors(error)
      expect(result).toBe('Network error occurred')
    })

    it('should handle array of errors', () => {
      const errors: DataError[] = [
        {
          kind: 'NetworkError',
          message: 'Network error occurred',
          timestamp: new Date(),
          source: 'test',
          statusCode: 500,
        },
        {
          kind: 'ValidationError',
          message: 'Invalid input',
          timestamp: new Date(),
          field: 'testField',
          value: 'testValue',
          constraints: ['required'],
        },
      ]

      const result = ploc.handleErrors(errors)
      expect(result).toBe('Network error occurred, Invalid input')
    })

    it('should handle empty error array', () => {
      const errors: DataError[] = []
      const result = ploc.handleErrors(errors)
      expect(result).toBe('')
    })

    it('should handle error with empty message', () => {
      const error: NetworkError = {
        kind: 'NetworkError',
        message: '',
        timestamp: new Date(),
        source: 'test',
        statusCode: 500,
      }

      const result = ploc.handleErrors(error)
      expect(result).toBe('')
    })

    it('should handle array with empty messages', () => {
      const errors: DataError[] = [
        {
          kind: 'NetworkError',
          message: '',
          timestamp: new Date(),
          source: 'test',
          statusCode: 500,
        },
        {
          kind: 'ValidationError',
          message: '',
          timestamp: new Date(),
          field: 'testField',
          value: 'testValue',
          constraints: ['required'],
        },
      ]

      const result = ploc.handleErrors(errors)
      expect(result).toBe(', ')
    })
  })
})
