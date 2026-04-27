import { SubscriptionStatus } from './common.types'

export interface Shop {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
  subscriptionStatus: SubscriptionStatus
  cashierLimit?: number
  createdAt: string
}

export interface CreateShopRequest {
  name: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
}

export interface UpdateShopRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  logoUrl?: string
}
