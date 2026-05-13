import { client } from './client'
import {
  WarehouseItem,
  StockLevel,
  StockMovement,
  AddStorageRequest,
  AdjustStockRequest,
} from '@/types/warehouse.types'
import { PaginatedResponse } from '@/types/common.types'

export const warehouseApi = {
  getWarehouse: async (
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<WarehouseItem>> => {
    const { data } = await client.get('/inventory/warehouse', { params })
    return data
  },

  addStorage: async (body: AddStorageRequest) => {
    const { data } = await client.post('/inventory/storage', body)
    return data
  },

  getStorageBatches: async (
    productId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<any>> => {
    const { data } = await client.get(`/inventory/storage/${productId}`, { params })
    return data
  },

  getLowStock: async (): Promise<StockLevel[]> => {
    const { data } = await client.get('/inventory/low-stock')
    return data
  },

  getStockLevel: async (productId: string): Promise<StockLevel> => {
    const { data } = await client.get(`/inventory/${productId}/level`)
    return data
  },

  getMovements: async (
    productId: string,
    params: { page?: number; limit?: number } = {}
  ): Promise<PaginatedResponse<StockMovement>> => {
    const { data } = await client.get(`/inventory/${productId}/movements`, { params })
    return data
  },

  adjustStock: async (body: AdjustStockRequest) => {
    const { data } = await client.post('/inventory/adjust', body)
    return data
  },
}
