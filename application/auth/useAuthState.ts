import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null

  otpLoading: boolean
  loginLoading: boolean
  logoutLoading: boolean
  refreshLoading: boolean

  otpError: string | null
  loginError: string | null
  logoutError: string | null
  refreshError: string | null
}

const useAuthState = create<AuthState>()(
  persist((): AuthState => ({
  accessToken: null,
  refreshToken: null,

  otpLoading: false,
  loginLoading: false,
  logoutLoading: false,
  refreshLoading: false,

  otpError: null,
  loginError: null,
  logoutError: null,
  refreshError: null,
}), {
  name: 'tumamtuma-auth',
  partialize: (state: AuthState) => ({
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
  }),
  storage: createJSONStorage(() => localStorage),
}))

export default useAuthState
