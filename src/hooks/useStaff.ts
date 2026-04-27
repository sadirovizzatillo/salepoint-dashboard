import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { staffApi } from '@/api/staff.api'
import { CreateStaffRequest } from '@/types/employee.types'
import { message } from 'antd'

export const STAFF_KEY = 'staff'

export const useStaff = () =>
  useQuery({
    queryKey: [STAFF_KEY],
    queryFn: staffApi.list,
  })

export const useCreateStaff = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: CreateStaffRequest) => staffApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STAFF_KEY] })
      message.success("Xodim qo'shildi")
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      const status = err.response?.status
      if (status === 403) {
        message.error("Tarif rejangizni yangilang — xodimlar limiti to'ldi")
      } else if (status === 409) {
        message.error('Bu email allaqachon xodimlar ro\'yxatida')
      } else {
        message.error('Xatolik yuz berdi')
      }
    },
  })
}

export const useRemoveStaff = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => staffApi.remove(userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STAFF_KEY] })
      message.success("Xodim o'chirildi")
    },
    onError: (err: AxiosError) => {
      if (err.response?.status === 404) {
        message.error('Xodim topilmadi')
      } else {
        message.error('Xatolik yuz berdi')
      }
    },
  })
}
