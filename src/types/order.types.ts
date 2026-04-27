export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED'

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  name: string
  price: string
  quantity: number
  taxRate: string
  lineTotal: string
}

export interface OrderCashier {
  id: string
  name: string
  email: string
  roles: string[]
  isActive: boolean
  avatarUrl?: string | null
  lastLoginAt?: string | null
}

export interface OrderCustomer {
  id: string
  name: string
  phone: string
  loyaltyPoints: number
  totalSpent: string
  visitCount: number
  notes?: string
}

export interface Order {
  id: string
  status: OrderStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  customerId?: string
  customerName?: string
  customer?: OrderCustomer
  cashierId: string
  cashierName?: string
  cashier?: OrderCashier
  createdAt: string
}

export interface OrderFilters {
  page?: number
  limit?: number
  status?: OrderStatus
  from?: string
  to?: string
  cashierId?: string
}
