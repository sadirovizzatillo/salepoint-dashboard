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

export interface MeShop {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  logoUrl: string | null
  subscriptionStatus: 'trial' | 'active' | 'expired' | 'suspended'
  subscriptionExpiresAt: string | null
  roles: UserRole[]
}

export interface Me {
  id: string
  email: string
  name: string
  roles: UserRole[]
  isActive: boolean
  avatarUrl: string | null
  lastLoginAt: string | null
  sessionId: string
  shop: MeShop | null
}
