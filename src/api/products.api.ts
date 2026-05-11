import axios from 'axios'
import { client } from './client'
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
  ImageUploadUrlRequest,
  ImageUploadUrlResponse,
  ConfirmImageRequest,
} from '@/types/product.types'
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

  getImageUploadUrl: async (
    id: string,
    body: ImageUploadUrlRequest,
  ): Promise<ImageUploadUrlResponse> => {
    const { data } = await client.post(`/products/${id}/image/upload-url`, body)
    return data
  },

  putToSpaces: async (uploadUrl: string, file: File | Blob): Promise<void> => {
    await axios.put(uploadUrl, file, {
      headers: { 'Content-Type': file.type, 'x-amz-acl': 'public-read' },
      transformRequest: [(d) => d],
    })
  },

  confirmImage: async (id: string, body: ConfirmImageRequest): Promise<Product> => {
    const { data } = await client.patch(`/products/${id}/image`, body)
    return data
  },

  removeImage: async (id: string): Promise<Product> => {
    const { data } = await client.delete(`/products/${id}/image`)
    return data
  },
}
