import { client } from './client'
import { Shop, CreateShopRequest, UpdateShopRequest } from '@/types/shop.types'

export const shopsApi = {
  list: async (): Promise<Shop[]> => {
    const { data } = await client.get('/shop/shops')
    return data
  },

  getById: async (shopId: string): Promise<Shop> => {
    const { data } = await client.get(`/shop/shops/${shopId}`)
    return data
  },

  create: async (body: CreateShopRequest): Promise<Shop> => {
    const { data } = await client.post('/shop/shops', body)
    return data
  },

  update: async (shopId: string, body: UpdateShopRequest): Promise<Shop> => {
    const { data } = await client.patch(`/shop/shops/${shopId}`, body)
    return data
  },
}
