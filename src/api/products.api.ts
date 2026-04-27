import { client } from './client'
import { Product, CreateProductRequest, UpdateProductRequest, ProductFilters } from '@/types/product.types'
import { PaginatedResponse } from '@/types/common.types'

export const productsApi = {
  list: async (filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> => {
    const { data } = await client.get('/products', { params: filters })
    return data
  },

  getById: async (id: string): Promise<Product> => {
    const { data } = await client.get(`/products/${id}`)
    return data
  },

  getByBarcode: async (barcode: string): Promise<Product> => {
    const { data } = await client.get(`/products/barcode/${barcode}`)
    return data
  },

  create: async (body: CreateProductRequest): Promise<Product> => {
    const { data } = await client.post('/products', body)
    return data
  },

  update: async (id: string, body: UpdateProductRequest): Promise<Product> => {
    const { data } = await client.patch(`/products/${id}`, body)
    return data
  },

  delete: async (id: string): Promise<void> => {
    await client.delete(`/products/${id}`)
  },
}
