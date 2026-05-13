import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { debtsApi } from '@/api/debts.api'
import { RepayDebtRequest } from '@/types/debt.types'
import { message } from 'antd'

export const DEBTS_KEY = 'debts'
export const DEBTS_SUMMARY_KEY = 'debts-summary'

export const useDebtsSummary = (params: { page?: number; limit?: number; search?: string } = {}) =>
  useQuery({
    queryKey: [DEBTS_SUMMARY_KEY, params],
    queryFn: () => debtsApi.summary(params),
  })

export const useDebts = (params: { page?: number; limit?: number; customerId?: string } = {}) =>
  useQuery({
    queryKey: [DEBTS_KEY, params],
    queryFn: () => debtsApi.list(params),
    enabled: !!params.customerId,
  })

export const useRepayDebt = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: RepayDebtRequest }) => debtsApi.repay(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [DEBTS_KEY] })
      qc.invalidateQueries({ queryKey: [DEBTS_SUMMARY_KEY] })
      message.success("To'lov qabul qilindi")
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}

export const useSendSmsReminder = () =>
  useMutation({
    mutationFn: (customerId: string) => debtsApi.sendSmsReminder(customerId),
    onSuccess: () => message.success("SMS navbatga qo'shildi"),
    onError: (err: AxiosError<{ message?: string }>) => {
      message.error(err.response?.data?.message || 'Xatolik yuz berdi')
    },
  })
