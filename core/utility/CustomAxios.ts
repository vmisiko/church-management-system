/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosRequestHeaders } from 'axios'
import { NetworkConstants } from './NetworkConstants'
import type {
  AuthenticationError,
  AuthorizationError,
  DataError,
  NetworkError,
  TimeoutError,
} from '../domain/DataError'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type GetToken = () => string | null | Promise<string | null>
type GetApplicationId = () => string | null | Promise<string | null>

let isRedirectingToSignin = false
export interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders
}

export class CustomAxios {
  private axiosInstance: AxiosInstance
  private readonly maxRetries = 2
  private readonly retryDelay = 1000
  private router?: AppRouterInstance

  constructor({
    getToken,
    getApplicationId,
    router,
  }: {
    getToken: GetToken
    getApplicationId?: GetApplicationId
    router?: AppRouterInstance
  }) {
    this.axiosInstance = axios.create({
      baseURL: NetworkConstants.BASE_URL,
      timeout: 10000,
      withCredentials: true, // Always send cookies
    })

    this.router = router
    this.axiosInstance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        config.headers['Content-Type'] = 'application/json'
        config.headers['Accept'] = 'application/json'

        const token = await Promise.resolve(getToken())
        if (token) config.headers['Authorization'] = `Bearer ${token}`

        const applicationId = await Promise.resolve(getApplicationId?.() ?? null)
        if (applicationId) config.headers['x-application-id'] = applicationId

        config.withCredentials = true // Ensure it's also set per-request

        return config
      },
      (error) => Promise.reject(error),
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error): Promise<DataError> => {
        console.log('error, error was called', error)
        const baseErrorInfo = {
          timestamp: new Date(),
          source: 'HttpClient',
          originalError: error,
        }

        // this.analytics.track(this.getErrorType(error), {
        //   statusCode: error.response?.status,
        //   endpoint: error.config?.url,
        //   method: error.config?.method,
        //   error_message:
        //     error.response?.data?.message || error.response?.data?.detail || error.message,
        //   requestPayload: error.config?.data,
        //   timestamp: new Date().toISOString(),
        //   retryCount: error.config?.__retryCount || 0,
        //   errorObject: error,
        // })

        const config = error.config
        if (!config) {
          return Promise.reject<NetworkError>({
            ...baseErrorInfo,
            kind: 'NetworkError',
            message: 'Request configuration missing',
          })
        }

        // Retry on timeout or no response
        config.__retryCount = config.__retryCount || 0

        console.log('error.code, error.code was called', error.code)
        if (error.code === 'ECONNABORTED' || (!error.response && error.request)) {
          if (config.__retryCount < this.maxRetries) {
            config.__retryCount += 1
            console.warn(`Retrying request (${config.__retryCount}/${this.maxRetries})...`)

            await new Promise((resolve) => setTimeout(resolve, this.retryDelay))

            return this.axiosInstance.request(config)
          }

          return Promise.reject<TimeoutError>({
            ...baseErrorInfo,
            kind: 'TimeoutError',
            message: 'Request timed out after multiple retries',
            duration: this.axiosInstance.defaults.timeout || 5000,
          })
        }

        // HTTP error responses
        if (error.response) {
          console.log('error.response, error.response was called', error.response.status)
          const statusCode = error.response.status
          switch (statusCode) {
            case 401:
              console.log('401, 401 was called')
              if (this.router && !isRedirectingToSignin) {
                isRedirectingToSignin = true
                this.router.push('/auth/signin')
                setTimeout(() => { isRedirectingToSignin = false }, 1000)
              }

              return Promise.reject<AuthenticationError>({
                ...baseErrorInfo,
                kind: 'AuthenticationError',
                message:
                  error.response.data?.detail ||
                  error.response.data?.message ||
                  'Authentication failed',
                operation: 'request',
              })

            case 403:
              return Promise.reject<AuthorizationError>({
                ...baseErrorInfo,
                kind: 'AuthorizationError',
                message:
                  error.response.data?.detail ||
                  error.response.data?.message ||
                  'Not authorized to perform this operation',
                operation: 'request',
                requiredPermissions:
                  error.response.headers['x-required-permissions']?.split(',') || [],
              })

            default:
              return Promise.reject<NetworkError>({
                ...baseErrorInfo,
                kind: 'NetworkError',
                message:
                  error.response.data?.message ||
                  error.response.data?.detail ||
                  'Unexpected error occurred',
                statusCode,
                code: error.response.data?.code,
              })
          }
        }

        return Promise.reject<NetworkError>({
          ...baseErrorInfo,
          kind: 'NetworkError',
          message:
            error.response.data?.detail ||
            error.response.data?.message ||
            'Failed to setup the request',
          code: error.code,
        })
      },
    )
  }

  get(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.get(url, { ...config, withCredentials: true })
  }

  post(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.post(url, data, { ...config, withCredentials: true })
  }

  put(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.put(url, data, { ...config, withCredentials: true })
  }

  patch(url: string, data?: any, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.patch(url, data, { ...config, withCredentials: true })
  }

  delete(url: string, config: AxiosRequestConfig = {}) {
    return this.axiosInstance.delete(url, { ...config, withCredentials: true })
  }

  private getErrorType(error: any): string {
    if (error.code === 'ECONNABORTED') {
      return 'Request Timeout'
    }

    if (!error.response) {
      return 'Network Error'
    }

    const statusCode = error.response.status
    switch (statusCode) {
      case 400:
        return 'Bad Request'
      case 401:
        return 'Authentication Error'
      case 403:
        return 'Authorization Error'
      case 404:
        return 'Resource Not Found'
      case 408:
        return 'Request Timeout'
      case 409:
        return 'Conflict'
      case 422:
        return 'Validation Error'
      case 429:
        return 'Too Many Requests'
      case 500:
        return 'Server Error'
      case 502:
        return 'Bad Gateway'
      case 503:
        return 'Service Unavailable'
      case 504:
        return 'Gateway Timeout'
      default:
        return `HTTP Error ${statusCode}`
    }
  }
}

export default CustomAxios
