export interface Customer {
  id: string
  name: string
  phone: string
  notes?: string
  totalOrders?: number
  totalSpent?: number
  createdAt: string
}

export interface CreateCustomerRequest {
  name: string
  phone: string
  notes?: string
}

export type UpdateCustomerRequest = Partial<CreateCustomerRequest>
