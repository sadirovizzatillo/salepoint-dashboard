import { client } from './client'
import { StaffMember, CreateStaffRequest } from '@/types/employee.types'

export const staffApi = {
  list: async (): Promise<StaffMember[]> => {
    const { data } = await client.get('/shop/staff')
    return data
  },

  create: async (body: CreateStaffRequest): Promise<StaffMember> => {
    const { data } = await client.post('/shop/staff', body)
    return data
  },

  remove: async (userId: string): Promise<void> => {
    await client.delete(`/shop/staff/${userId}`)
  },
}
