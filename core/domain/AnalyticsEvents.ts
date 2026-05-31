/* eslint-disable @typescript-eslint/no-explicit-any */
export class AnalyticsEvents {
  // Error Events

  static readonly REQUEST_ERROR = 'Request Error'
  static readonly NETWORK_ERROR = 'Network Error'
  static readonly TIMEOUT_ERROR = 'Timeout Error'
  static readonly SERVER_ERROR = 'Server Error'
  static readonly CLIENT_ERROR = 'Client Error'
  static readonly OTHER_ERROR = 'Other Error'
  static readonly BAD_REQUEST_ERROR = 'Bad Request Error'
  static readonly AUTHORIZATION_ERROR = 'Authorization Error'
  static readonly NOT_FOUND_ERROR = 'Not Found Error'
}

// Type definitions for event properties
export interface PaymentEventProperties {
  email?: string
  name?: string
  role?: string
  merchant?: string
  device_type?: 'Web' | 'Mobile' | 'Tablet'
  payment_method?: string
  transaction_id?: string
  amount?: number
  card_type?: 'Visa' | 'Mastercard' | 'Amex'
  last4_digits?: string
  phone_number?: string
  network?: string
  error_message?: string
  timestamp?: string
  card_count?: number
  auth_method?: string
  failure_reason?: string
  order_id?: string
  currency?: string
  // Error tracking properties
  errorType?: string
  statusCode?: number
  endpoint?: string
  method?: string
  retryCount?: number
  requestPayload?: Record<string, unknown>
  errorObject?: Record<string, unknown>
  [key: string]: any
}
