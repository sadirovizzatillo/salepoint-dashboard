export interface Product {
  id: string
  name: string
  sku: string
  price: number
  costPrice: number
  barcode?: string
  taxRate?: number
  isActive: boolean
  trackStock: boolean
  categoryId?: string
  categoryName?: string
  description?: string
  imageUrl?: string
  stockLevel?: number
  createdAt: string
  updatedAt: string
}

export interface CreateProductRequest {
  name: string
  sku: string
  price: number
  costPrice: number
  barcode?: string
  taxRate?: number
  isActive: boolean
  trackStock: boolean
  categoryId?: string
  description?: string
  imageUrl?: string
}

export type UpdateProductRequest = Partial<CreateProductRequest>

export interface ProductFilters {
  page?: number
  limit?: number
  search?: string
  categoryId?: string
  active?: boolean
}
