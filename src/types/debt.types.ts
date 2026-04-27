export type DebtStatus = 'PENDING' | 'PARTIAL' | 'PAID'

export interface DebtSummaryItem {
  customerId: string
  customerName: string
  phone: string
  debtCount: number
  totalRemaining: number
  oldestDebtAt: string
}

export interface DebtSummaryResponse {
  data: DebtSummaryItem[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

export interface Debt {
  id: string
  customerId: string
  customerName: string
  customerPhone?: string
  amount: number
  paidAmount: number
  remainingAmount: number
  status: DebtStatus
  description?: string
  createdAt: string
  updatedAt: string
}

export interface RepayDebtRequest {
  amount: number
}

export interface SmsReminderResponse {
  queued: boolean
  smsLogId: string
}
