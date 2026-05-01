export type SmsStatus = 'pending' | 'sent' | 'delivered' | 'failed'

export interface SmsLog {
  id: string
  createdAt: string
  updatedAt: string
  shopId: string | null
  sentByUserId: string | null
  customerId: string | null
  debtId: string | null
  phone: string
  message: string
  status: SmsStatus
  provider: string
  providerSmsId: number | null
  providerRequestId: string | null
  attempts: number
  errorMessage: string | null
  sentAt: string | null
  deliveredAt: string | null
  failedAt: string | null
}

export interface SmsLogsTotals {
  all: number
  pending: number
  sent: number
  delivered: number
  failed: number
}

export interface SmsLogsMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface SmsLogsResponse {
  data: SmsLog[]
  meta: SmsLogsMeta
  totals: SmsLogsTotals
}

export interface SmsLogsQuery {
  userId?: string | 'all'
  status?: SmsStatus
  from?: string
  to?: string
  page?: number
  limit?: number
}
