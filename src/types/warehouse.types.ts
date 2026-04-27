export interface WarehouseItem {
  id: string
  productId: string
  quantityOnHand: number
  quantityReserved: number
  reorderPoint: number
  product: {
    name: string
    sku: string
    price: number
    category: { id: string; name: string } | null
  }
}

export interface StockLevel {
  productId: string
  productName: string
  quantity: number
  reorderPoint?: number
}

export interface StockMovement {
  id: string
  type: 'IN' | 'OUT' | 'ADJUST'
  quantity: number
  notes?: string
  createdAt: string
}

export interface AddStorageRequest {
  productId: string
  quantity: number
  costPrice: number
  margin: number
  syncProductPrice: boolean
  notes?: string
}

export interface AdjustStockRequest {
  productId: string
  quantity: number
  notes?: string
}
