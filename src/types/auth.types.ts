import { SubscriptionStatus } from './common.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface ShopOption {
  id: string
  name: string
  logoUrl?: string
  roles: UserRole[]
  subscriptionStatus: SubscriptionStatus
}

export interface LoginResponse {
  preAuthToken: string
  shops: ShopOption[]
}

export interface SelectShopRequest {
  shopId: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface RefreshRequest {
  refreshToken: string
}

export type UserRole = 'CASHIER' | 'MANAGER' | 'ADMIN' | 'SHOP_OWNER'
