import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('NetworkConstants', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('uses NEXT_PUBLIC_API_URL when set', async () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.citymega.org'

    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe('https://api.citymega.org')
  })

  it('falls back to localhost:3001 when NEXT_PUBLIC_API_URL is not set', async () => {
    delete process.env.NEXT_PUBLIC_API_URL

    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe('http://localhost:3001')
  })

  it('falls back to localhost:3001 when NEXT_PUBLIC_API_URL is empty', async () => {
    process.env.NEXT_PUBLIC_API_URL = ''

    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe('http://localhost:3001')
  })
})
