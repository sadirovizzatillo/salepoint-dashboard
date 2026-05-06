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

export type AllowedImageMime = 'image/jpeg' | 'image/png' | 'image/webp'

export const ALLOWED_IMAGE_MIMES: AllowedImageMime[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024

export interface ImageUploadUrlRequest {
  contentType: AllowedImageMime
  size: number
}

export interface ImageUploadUrlResponse {
  uploadUrl: string
  key: string
  expiresIn: number
}

export interface ConfirmImageRequest {
  key: string
}
