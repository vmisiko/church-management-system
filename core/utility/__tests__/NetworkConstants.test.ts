import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NetworkConstants } from '../NetworkConstants'

describe('NetworkConstants', () => {
  const originalEnv = process.env

  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.clearAllMocks()
  })

  it('should use environment variable VITE_APP_BASE_URL when available', async () => {
    const customBaseUrl = 'https://custom-api.example.com/v1'
    vi.stubEnv('VITE_APP_BASE_URL', customBaseUrl)

    // Need to re-import the module to get the new environment variable
    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe(customBaseUrl)
  })

  it('should use default URL when VITE_APP_BASE_URL is not set', async () => {
    // Ensure VITE_APP_BASE_URL is not set
    delete process.env.VITE_APP_BASE_URL

    // Need to re-import the module to get the new environment variable
    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe('https://drive.pesapal.dev/v1')
  })

  it('should use default URL when VITE_APP_BASE_URL is empty', async () => {
    vi.stubEnv('VITE_APP_BASE_URL', '')

    // Need to re-import the module to get the new environment variable
    const { NetworkConstants } = await import('../NetworkConstants')

    expect(NetworkConstants.BASE_URL).toBe('https://drive.pesapal.dev/v1')
  })
})
