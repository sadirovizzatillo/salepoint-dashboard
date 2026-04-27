import { client } from './client'
import { Shift } from '@/types/shift.types'

export const shiftsApi = {
  list: async (): Promise<Shift[]> => {
    const { data } = await client.get('/shifts')
    return data
  },
}
