import type { DataError, NetworkError } from '@/core/domain/DataError'

export function mapToDataError(error: unknown): DataError {
  // CustomAxios interceptor already rejects with a shaped DataError
  if (error !== null && typeof error === 'object' && 'kind' in error) {
    return error as DataError
  }
  const message = error instanceof Error ? error.message : 'An unexpected error occurred'
  return {
    kind: 'NetworkError',
    message,
    source: 'Repository',
    timestamp: new Date(),
  } as NetworkError
}
