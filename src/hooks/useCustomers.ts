import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customersApi } from '@/api/customers.api'
import { CreateCustomerRequest, UpdateCustomerRequest } from '@/types/customer.types'
import { message } from 'antd'

export const CUSTOMERS_KEY = 'customers'

export const useCustomers = (params: { page?: number; limit?: number; search?: string } = {}) =>
  useQuery({
    queryKey: [CUSTOMERS_KEY, params],
    queryFn: () => customersApi.list(params),
  })

export const useCreateCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCustomerRequest) => customersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
      message.success("Mijoz qo'shildi")
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}

export const useUpdateCustomer = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateCustomerRequest }) =>
      customersApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CUSTOMERS_KEY] })
      message.success('Mijoz yangilandi')
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}
