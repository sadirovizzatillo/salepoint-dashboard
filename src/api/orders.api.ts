import { client } from './client'
import { Order, OrderFilters } from '@/types/order.types'
import { PaginatedResponse } from '@/types/common.types'

export const ordersApi = {
  list: async (filters: OrderFilters = {}): Promise<PaginatedResponse<Order>> => {
    const { data } = await client.get('/orders', { params: filters })
    return data
  },

  getById: async (id: string): Promise<Order> => {
    const { data } = await client.get(`/orders/${id}`)
    return data
  },

  getReceipt: async (id: string) => {
    const { data } = await client.get(`/orders/${id}/receipt`)
    return data
  },

  returnOrder: async (id: string, body: { items: { productId: string; quantity: number }[]; notes?: string }) => {
    const { data } = await client.post(`/orders/${id}/return`, body)
    return data
  },
}
