import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios'
import { CustomAxios } from '../CustomAxios'
import { Analytics } from '../Analytics'
import type { Router } from 'vue-router'
import { NetworkConstants } from '../NetworkConstants'
import type { DataError } from '../../domain/DataError'
import type { AuthPloc } from '@/application/Auth/AuthPloc'

// Extend Axios types to include our custom properties
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    __retryCount?: number
  }
}

// Mock axios
vi.mock('axios', () => {
  class AxiosHeaders {
    private headers: Record<string, string> = {}

    constructor(init?: Record<string, string>) {
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this.headers[key.toLowerCase()] = value
        })
      }
      return new Proxy(this, {
        get(target, prop) {
          if (typeof prop === 'string') {
            return target.headers[prop.toLowerCase()]
          }
          return target[prop as keyof typeof target]
        },
        set(target, prop, value) {
          if (typeof prop === 'string') {
            target.headers[prop.toLowerCase()] = value as string
            return true
          }
          return false
        },
      })
    }

    get(key: string): string | undefined {
      return this.headers[key.toLowerCase()]
    }

    set(key: string, value: string): void {
      this.headers[key.toLowerCase()] = value
    }

    has(key: string): boolean {
      return key.toLowerCase() in this.headers
    }

    delete(key: string): void {
      delete this.headers[key.toLowerCase()]
    }

    clear(): void {
      this.headers = {}
    }
  }

  const mockAxiosInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
    defaults: { timeout: 10000 },
  }

  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
      AxiosHeaders,
    },
  }
})

// Helper function to create AxiosError objects
function createAxiosError(overrides: Partial<AxiosError>): AxiosError {
  const config: InternalAxiosRequestConfig = {
    headers: new axios.AxiosHeaders(),
    url: '/test',
    method: 'get',
    ...overrides.config,
  }

  const response: AxiosResponse = {
    status: 200,
    statusText: 'OK',
    headers: new axios.AxiosHeaders(),
    config,
    data: {},
    ...overrides.response,
  }

  return {
    isAxiosError: true,
    toJSON: () => ({}),
    name: 'AxiosError',
    message: 'Request failed',
    config,
    response,
    ...overrides,
  } as AxiosError
}

describe('CustomAxios', () => {
  let customAxios: CustomAxios
  let mockAxiosInstance: AxiosInstance
  let mockAuthPloc: AuthPloc
  let mockAnalytics: Analytics
  let mockRequestInterceptor: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  let mockResponseInterceptor: (error: AxiosError) => Promise<DataError>

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Setup mock authPloc
    mockAuthPloc = {
      logout: vi.fn(),
    } as unknown as AuthPloc

    // Setup mock analytics
    mockAnalytics = {
      track: vi.fn(),
    } as unknown as Analytics

    // Create instance
    customAxios = new CustomAxios({
      token: 'test-token',
      authPloc: mockAuthPloc,
      analytics: mockAnalytics,
    })

    // Get the mock axios instance
    mockAxiosInstance = (axios.create as unknown as ReturnType<typeof vi.fn>)() as AxiosInstance

    // Capture interceptors
    const requestInterceptorUse = mockAxiosInstance.interceptors.request
      .use as unknown as ReturnType<typeof vi.fn>
    const responseInterceptorUse = mockAxiosInstance.interceptors.response
      .use as unknown as ReturnType<typeof vi.fn>
    mockRequestInterceptor = requestInterceptorUse.mock.calls[0][0]
    mockResponseInterceptor = responseInterceptorUse.mock.calls[0][1]
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: NetworkConstants.BASE_URL,
        timeout: 10000,
        withCredentials: true,
      })
    })

    it('should set up request interceptor with auth token', () => {
      const config: InternalAxiosRequestConfig = {
        headers: new axios.AxiosHeaders(),
        withCredentials: false,
      }
      const result = mockRequestInterceptor(config)

      expect(result.headers['Content-Type']).toBe('application/json')
      expect(result.headers['Accept']).toBe('application/json')
      expect(result.headers['Authorization']).toBe('Bearer test-token')
      expect(result.withCredentials).toBe(true)
    })

    it('should set up request interceptor without auth token', () => {
      const customAxiosNoToken = new CustomAxios({
        token: null,
        authPloc: mockAuthPloc,
        analytics: mockAnalytics,
      })
      const config: InternalAxiosRequestConfig = {
        headers: new axios.AxiosHeaders(),
        withCredentials: false,
      }
      const requestInterceptorUse = mockAxiosInstance.interceptors.request
        .use as unknown as ReturnType<typeof vi.fn>
      const noTokenInterceptor = requestInterceptorUse.mock.calls[1][0]
      const result = noTokenInterceptor(config)

      expect(result.headers['Authorization']).toBeUndefined()
    })
  })

  describe('HTTP methods', () => {
    const testUrl = '/test'
    const testData = { data: 'test' }
    const testConfig = { headers: { 'Custom-Header': 'test' } }

    it('should call get with correct parameters', async () => {
      await customAxios.get(testUrl, testConfig)
      expect(mockAxiosInstance.get).toHaveBeenCalledWith(testUrl, {
        ...testConfig,
        withCredentials: true,
      })
    })

    it('should call post with correct parameters', async () => {
      await customAxios.post(testUrl, testData, testConfig)
      expect(mockAxiosInstance.post).toHaveBeenCalledWith(testUrl, testData, {
        ...testConfig,
        withCredentials: true,
      })
    })

    it('should call put with correct parameters', async () => {
      await customAxios.put(testUrl, testData, testConfig)
      expect(mockAxiosInstance.put).toHaveBeenCalledWith(testUrl, testData, {
        ...testConfig,
        withCredentials: true,
      })
    })

    it('should call patch with correct parameters', async () => {
      await customAxios.patch(testUrl, testData, testConfig)
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith(testUrl, testData, {
        ...testConfig,
        withCredentials: true,
      })
    })

    it('should call delete with correct parameters', async () => {
      await customAxios.delete(testUrl, testConfig)
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith(testUrl, {
        ...testConfig,
        withCredentials: true,
      })
    })
  })

  describe('error handling', () => {
    it('should handle authentication error (401)', async () => {
      const error = createAxiosError({
        response: {
          status: 401,
          statusText: 'Unauthorized',
          headers: new axios.AxiosHeaders(),
          config: {
            headers: new axios.AxiosHeaders(),
            url: '/test',
            method: 'get',
          },
          data: { message: 'Unauthorized' },
        },
      })

      await expect(mockResponseInterceptor(error)).rejects.toMatchObject({
        kind: 'AuthenticationError',
        message: 'Unauthorized',
      })
      expect(mockAuthPloc.logout).toHaveBeenCalled()
    })

    it('should handle authorization error (403)', async () => {
      const error = createAxiosError({
        response: {
          status: 403,
          statusText: 'Forbidden',
          headers: new axios.AxiosHeaders({ 'x-required-permissions': 'read,write' }),
          config: {
            headers: new axios.AxiosHeaders(),
            url: '/test',
            method: 'get',
          },
          data: { message: 'Forbidden' },
        },
      })

      const responseInterceptorUse = mockAxiosInstance.interceptors.response
        .use as unknown as ReturnType<typeof vi.fn>
      const responseInterceptor = responseInterceptorUse.mock.calls[0][1]

      await expect(responseInterceptor(error)).rejects.toMatchObject({
        kind: 'AuthorizationError',
        message: 'Forbidden',
        requiredPermissions: ['read', 'write'],
      })
    })

    it('should handle timeout error', async () => {
      const error = createAxiosError({
        code: 'ECONNABORTED',
        config: {
          headers: new axios.AxiosHeaders(),
          url: '/test',
          method: 'get',
          __retryCount: 2,
        },
      })

      const responseInterceptorUse = mockAxiosInstance.interceptors.response
        .use as unknown as ReturnType<typeof vi.fn>
      const responseInterceptor = responseInterceptorUse.mock.calls[0][1]

      await expect(responseInterceptor(error)).rejects.toMatchObject({
        kind: 'TimeoutError',
      })
    })

    it('should handle network error', async () => {
      const error = createAxiosError({
        response: {
          status: 500,
          statusText: 'Server Error',
          headers: new axios.AxiosHeaders(),
          config: {
            headers: new axios.AxiosHeaders(),
            url: '/test',
            method: 'get',
          },
          data: { message: 'Server Error' },
        },
      })

      await expect(mockResponseInterceptor(error)).rejects.toMatchObject({
        kind: 'NetworkError',
        message: 'Server Error',
        statusCode: 500,
      })
    })

    it('should handle GraphQL errors', async () => {
      const error = createAxiosError({
        response: {
          status: 200,
          statusText: 'OK',
          headers: new axios.AxiosHeaders(),
          config: {
            headers: new axios.AxiosHeaders(),
            url: '/test',
            method: 'post',
          },
          data: {
            errors: [
              {
                message: 'GraphQL Error',
                locations: [{ line: 1, column: 1 }],
                path: ['query'],
              },
            ],
          },
        },
      })

      await expect(mockResponseInterceptor(error)).rejects.toMatchObject({
        kind: 'GraphQLError',
        message: 'GraphQL Error',
      })
    })
  })

  describe('retry mechanism', () => {
    it('should retry on timeout', async () => {
      const error = createAxiosError({
        code: 'ECONNABORTED',
        config: {
          headers: new axios.AxiosHeaders(),
          url: '/test',
          method: 'get',
          __retryCount: 0,
        },
      })

      const mockRequest = mockAxiosInstance.request as unknown as ReturnType<typeof vi.fn>
      mockRequest.mockResolvedValueOnce({ data: 'success' })

      await mockResponseInterceptor(error)

      expect(mockAxiosInstance.request).toHaveBeenCalled()
      expect(mockRequest.mock.calls[0][0].__retryCount).toBe(1)
    })

    it('should stop retrying after max retries', async () => {
      const error = createAxiosError({
        code: 'ECONNABORTED',
        config: {
          headers: new axios.AxiosHeaders(),
          url: '/test',
          method: 'get',
          __retryCount: 2,
        },
      })

      await expect(mockResponseInterceptor(error)).rejects.toMatchObject({
        kind: 'TimeoutError',
      })
      expect(mockAxiosInstance.request).not.toHaveBeenCalled()
    })
  })
})
