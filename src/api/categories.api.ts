import { client } from './client'
import { Category, CreateCategoryRequest } from '@/types/category.types'

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await client.get('/categories')
    return data
  },

  create: async (body: CreateCategoryRequest): Promise<Category> => {
    const { data } = await client.post('/categories', body)
    return data
  },
}
