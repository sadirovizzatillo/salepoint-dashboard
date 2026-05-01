export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface ApiError {
  message: string
  statusCode: number
}

export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'suspended'
