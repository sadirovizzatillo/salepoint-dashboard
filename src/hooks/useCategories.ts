import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { categoriesApi } from '@/api/categories.api'
import { CreateCategoryRequest } from '@/types/category.types'
import { message } from 'antd'

export const CATEGORIES_KEY = 'categories'

export const useCategories = () =>
  useQuery({
    queryKey: [CATEGORIES_KEY],
    queryFn: () => categoriesApi.list(),
  })

export const useCreateCategory = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => categoriesApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [CATEGORIES_KEY] })
      message.success("Kategoriya qo'shildi")
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}
