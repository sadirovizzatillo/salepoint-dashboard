import { client } from './client'
import {
  Debt,
  DebtSummaryResponse,
  RepayDebtRequest,
  SmsReminderResponse,
} from '@/types/debt.types'
import { PaginatedResponse } from '@/types/common.types'

export const debtsApi = {
  summary: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<DebtSummaryResponse> => {
    const { data } = await client.get('/debts/summary', { params })
    return data
  },

  list: async (params: { page?: number; limit?: number; customerId?: string } = {}): Promise<PaginatedResponse<Debt>> => {
    const { data } = await client.get('/debts', { params })
    return data
  },

  getById: async (id: string): Promise<Debt> => {
    const { data } = await client.get(`/debts/${id}`)
    return data
  },

  repay: async (id: string, body: RepayDebtRequest): Promise<Debt> => {
    const { data } = await client.patch(`/debts/${id}/repay`, body)
    return data
  },

  sendSmsReminder: async (customerId: string): Promise<SmsReminderResponse> => {
    const { data } = await client.post(`/debts/customers/${customerId}/sms-reminder`)
    return data
  },
}
