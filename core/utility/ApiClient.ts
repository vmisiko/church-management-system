import { Either } from '@/core/domain/Either'
import type { DataError, NetworkError, AuthenticationError } from '@/core/domain/DataError'
import { NetworkConstants } from './NetworkConstants'
import { tokenStorage } from '@/core/tokenStorage'

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

function makeNetworkError(message: string, statusCode?: number): NetworkError {
  return {
    kind: 'NetworkError',
    message,
    statusCode,
    source: 'ApiClient',
    timestamp: new Date(),
  }
}

function makeAuthError(message: string): AuthenticationError {
  return {
    kind: 'AuthenticationError',
    message,
    operation: 'request',
    timestamp: new Date(),
  }
}

async function tryRefresh(): Promise<string | null> {
  try {
    const res = await fetch(`${NetworkConstants.BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include', // sends the httpOnly refresh_token cookie
    })
    if (!res.ok) return null
    const data = await res.json()
    const token: string = data.accessToken
    tokenStorage.setAccessToken(token)
    return token
  } catch {
    return null
  }
}

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  retry = true,
): Promise<Either<DataError, T>> {
  const token = tokenStorage.getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res = await fetch(`${NetworkConstants.BASE_URL}${path}`, {
      method,
      headers,
      credentials: 'include',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })

    if (res.status === 401 && retry) {
      const newToken = await tryRefresh()
      if (!newToken) {
        tokenStorage.clear()
        return Either.left(makeAuthError('Session expired — please log in again'))
      }
      return request<T>(method, path, body, false)
    }

    if (res.status === 204) {
      return Either.right(undefined as T)
    }

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText)
      let message = text
      try {
        const json = JSON.parse(text)
        message = json.message ?? text
      } catch { /* not JSON */ }
      return Either.left(makeNetworkError(message, res.status))
    }

    const data: T = await res.json()
    return Either.right(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Network request failed'
    return Either.left(makeNetworkError(message))
  }
}

export const apiClient = {
  get<T>(path: string) {
    return request<T>('GET', path)
  },
  post<T>(path: string, body?: unknown) {
    return request<T>('POST', path, body)
  },
  patch<T>(path: string, body?: unknown) {
    return request<T>('PATCH', path, body)
  },
  delete<T = void>(path: string) {
    return request<T>('DELETE', path)
  },
}
