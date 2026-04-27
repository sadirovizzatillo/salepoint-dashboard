export type ShiftStatus = 'open' | 'closed'

export interface Shift {
  id: string
  shopId: string
  cashierId: string
  cashier: { id: string; name: string }
  status: ShiftStatus
  openingFloat: number
  closingFloat: number | null
  cashSales: number
  cardSales: number
  totalSales: number
  orderCount: number
  openedAt: string
  closedAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}
