const ACCESS_KEY = 'cms-access-token'

function isBrowser() {
  return typeof window !== 'undefined'
}

export const tokenStorage = {
  getAccessToken(): string | null {
    if (!isBrowser()) return null
    return localStorage.getItem(ACCESS_KEY)
  },

  setAccessToken(token: string): void {
    if (!isBrowser()) return
    localStorage.setItem(ACCESS_KEY, token)
  },

  // kept for compatibility with AuthPloc.setTokens() signature
  setTokens(access: string, _refresh: string): void {
    if (!isBrowser()) return
    localStorage.setItem(ACCESS_KEY, access)
  },

  clear(): void {
    if (!isBrowser()) return
    localStorage.removeItem(ACCESS_KEY)
  },
}
