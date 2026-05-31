/* eslint-disable @typescript-eslint/no-explicit-any */
// Base error interface that all domain errors should implement
export interface DomainError {
  kind: string
  message: string
  timestamp: Date
  code?: string
}

// Infrastructure/External errors
export interface InfrastructureError extends DomainError {
  source: string
  originalError?: Error
}

export interface NetworkError extends InfrastructureError {
  kind: 'NetworkError'
  statusCode?: number
}

export interface TimeoutError extends InfrastructureError {
  kind: 'TimeoutError'
  duration: number
}

// Application/Domain errors
export interface ValidationError extends DomainError {
  kind: 'ValidationError'
  field: string
  value: any
  constraints: string[]
}

export interface BusinessRuleError extends DomainError {
  kind: 'BusinessRuleError'
  rule: string
  context: Record<string, any>
}

// Security errors
export interface SecurityError extends DomainError {
  kind: 'SecurityError' | 'AuthenticationError' | 'AuthorizationError'
  operation: string
}

export interface AuthenticationError extends SecurityError {
  kind: 'AuthenticationError'
}

export interface AuthorizationError extends SecurityError {
  kind: 'AuthorizationError'
  requiredPermissions: string[]
}

// Aggregate error for multiple errors
export interface ErrorFold extends DomainError {
  kind: 'ErrorFold'
  errors: DomainError[]
}

export interface GraphQLError extends InfrastructureError {
  kind: 'GraphQLError'
  locations: Array<{ line: number; column: number }>
  path: string[]
  extensions: {
    code: string
  }
}

export type DataError =
  | NetworkError
  | TimeoutError
  | ValidationError
  | BusinessRuleError
  | AuthenticationError
  | AuthorizationError
  | ErrorFold
  | GraphQLError
