import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export interface AuthState {
  accessToken: string | null
  currentUser: { id: string; email: string; role: string } | null

  loginLoading: boolean
  logoutLoading: boolean
  meLoading: boolean

  loginError: string | null
  logoutError: string | null
}

const useAuthState = create<AuthState>()(
  persist(
    (): AuthState => ({
      accessToken: null,
      currentUser: null,

      loginLoading: false,
      logoutLoading: false,
      meLoading: false,

      loginError: null,
      logoutError: null,
    }),
    {
      name: 'cms-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        currentUser: state.currentUser,
      }),
      storage: createJSONStorage(() => localStorage),
    },
  ),
)

export default useAuthState
