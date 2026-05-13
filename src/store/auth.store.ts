import { create } from 'zustand'
import { ShopOption } from '@/types/auth.types'
import { authApi } from '@/api/auth.api'

interface AuthState {
  // Step 1 — after /auth/login
  preAuthToken: string | null
  shops: ShopOption[]

  // Step 2 — after /auth/select-shop
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean

  // Actions
  setPreAuth: (token: string, shops: ShopOption[]) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearPreAuth: () => void
  logout: () => void
  hydrateFromStorage: () => void
  switchShop: (shopId: string) => Promise<void>
}

export const useAuthStore = create<AuthState>(set => ({
  preAuthToken: null,
  shops: [],
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setPreAuth: (token, shops) => set({ preAuthToken: token, shops }),

  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    set({
      accessToken,
      refreshToken,
      isAuthenticated: true,
      preAuthToken: null,
      shops: [],
    })
  },

  clearPreAuth: () => set({ preAuthToken: null, shops: [] }),

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      preAuthToken: null,
      shops: [],
    })
  },

  hydrateFromStorage: () => {
    const accessToken = localStorage.getItem('accessToken')
    const refreshToken = localStorage.getItem('refreshToken')
    if (accessToken && refreshToken) {
      set({ accessToken, refreshToken, isAuthenticated: true })
    }
  },

  switchShop: async (shopId: string) => {
    const tokens = await authApi.switchShop(shopId)
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    set({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  },
}))
