import axios from 'axios'
import { LoginRequest, LoginResponse, SelectShopRequest, AuthTokens } from '@/types/auth.types'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

// Auth calls use a plain axios instance (no token interceptors needed for login)
const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const authApi = {
  login: async (body: LoginRequest): Promise<LoginResponse> => {
    const { data } = await authAxios.post('/auth/login', body)
    return data.data
  },

  selectShop: async (body: SelectShopRequest, preAuthToken: string): Promise<AuthTokens> => {
    const { data } = await authAxios.post('/auth/select-shop', body, {
      headers: { Authorization: `Bearer ${preAuthToken}` },
    })
    return data.data
  },

  switchShop: async (shopId: string): Promise<AuthTokens> => {
    const token = localStorage.getItem('accessToken')
    const { data } = await authAxios.post(
      '/auth/switch-shop',
      { shopId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return data.data
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('accessToken')
    await authAxios.post('/auth/logout', {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
  },
}
