import { client } from './client'
import { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '@/types/customer.types'
import { PaginatedResponse } from '@/types/common.types'

export const customersApi = {
  list: async (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<Customer>> => {
    const { data } = await client.get('/customers', { params })
    return data
  },

  getById: async (id: string): Promise<Customer> => {
    const { data } = await client.get(`/customers/${id}`)
    return data
  },

  getByPhone: async (phone: string): Promise<Customer> => {
    const { data } = await client.get(`/customers/phone/${phone}`)
    return data
  },

  create: async (body: CreateCustomerRequest): Promise<Customer> => {
    const { data } = await client.post('/customers', body)
    return data
  },

  update: async (id: string, body: UpdateCustomerRequest): Promise<Customer> => {
    const { data } = await client.patch(`/customers/${id}`, body)
    return data
  },
}
