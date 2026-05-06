import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { message } from 'antd'
import { productsApi } from '@/api/products.api'
import { Product, AllowedImageMime } from '@/types/product.types'
import { validateImage, compressImage } from '@/utils/image'
import { PRODUCTS_KEY } from './useProducts'

const apiErrorMessage = (err: unknown, fallback: string) => {
  const ax = err as AxiosError<{ message?: string }>
  const status = ax.response?.status
  if (status === 403) return "Ruxsat yo'q"
  if (status === 404) return 'Mahsulot yoki fayl topilmadi'
  if (status === 400) return ax.response?.data?.message || 'Noto\'g\'ri fayl'
  return ax.response?.data?.message || fallback
}

export const useUploadProductImage = () => {
  const qc = useQueryClient()
  return useMutation<Product, Error, { productId: string; file: File }>({
    mutationFn: async ({ productId, file }) => {
      const validationError = validateImage(file)
      if (validationError) throw new Error(validationError.message)

      const compressed = await compressImage(file)

      const { uploadUrl, key } = await productsApi.getImageUploadUrl(productId, {
        contentType: compressed.type as AllowedImageMime,
        size: compressed.size,
      })

      await productsApi.putToSpaces(uploadUrl, compressed)
      return productsApi.confirmImage(productId, { key })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
      message.success('Rasm yuklandi')
    },
    onError: (err) => {
      message.error(err.message || apiErrorMessage(err, 'Rasm yuklab bo\'lmadi'))
    },
  })
}

export const useRemoveProductImage = () => {
  const qc = useQueryClient()
  return useMutation<Product, AxiosError, string>({
    mutationFn: (productId) => productsApi.removeImage(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [PRODUCTS_KEY] })
      message.success("Rasm o'chirildi")
    },
    onError: (err) => message.error(apiErrorMessage(err, 'Xatolik yuz berdi')),
  })
}
