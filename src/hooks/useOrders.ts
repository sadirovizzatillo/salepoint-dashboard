import { useQuery } from '@tanstack/react-query'
import { ordersApi } from '@/api/orders.api'
import { OrderFilters } from '@/types/order.types'

export const ORDERS_KEY = 'orders'

export const useOrders = (filters: OrderFilters = {}) =>
  useQuery({
    queryKey: [ORDERS_KEY, filters],
    queryFn: () => ordersApi.list(filters),
  })

export const useOrder = (id: string) =>
  useQuery({
    queryKey: [ORDERS_KEY, id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  })
