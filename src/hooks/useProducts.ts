import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { productsApi } from '@/api/products.api'
import { ProductFilters, CreateProductRequest, UpdateProductRequest } from '@/types/product.types'
import { message } from 'antd'

export const PRODUCTS_KEY = 'products'

export const useProducts = (filters: ProductFilters = {}) =>
  useQuery({
    queryKey: [PRODUCTS_KEY, filters],
    queryFn: () => productsApi.list(filters),
  })

export const useProduct = (id: string) =>
  useQuery({
    queryKey: [PRODUCTS_KEY, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  })

export const useCreateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateProductRequest) => productsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
      message.success("Mahsulot qo'shildi")
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}

export const useUpdateProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateProductRequest }) =>
      productsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
      message.success('Mahsulot yangilandi')
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}

export const useDeleteProduct = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
      message.success("Mahsulot o'chirildi")
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })
}
