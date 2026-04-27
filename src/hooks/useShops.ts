import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { shopsApi } from '@/api/shops.api'
import { CreateShopRequest, UpdateShopRequest } from '@/types/shop.types'
import { message } from 'antd'

export const SHOPS_KEY = 'shops'

export const useShops = () =>
  useQuery({
    queryKey: [SHOPS_KEY],
    queryFn: shopsApi.list,
  })

export const useCreateShop = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateShopRequest) => shopsApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SHOPS_KEY] })
      message.success("Do'kon qo'shildi")
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 403) {
        message.error("Do'konlar limitiga yetdingiz — tarifni yangilang")
      } else {
        message.error('Xatolik yuz berdi')
      }
    },
  })
}

export const useUpdateShop = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ shopId, body }: { shopId: string; body: UpdateShopRequest }) =>
      shopsApi.update(shopId, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [SHOPS_KEY] })
      message.success("Do'kon yangilandi")
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 403) {
        message.error("Bu do'konga ruxsatingiz yo'q")
      } else {
        message.error('Xatolik yuz berdi')
      }
    },
  })
}
