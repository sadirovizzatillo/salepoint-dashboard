import { client } from './client'
import { SmsLogsQuery, SmsLogsResponse } from '@/types/sms.types'

export const smsApi = {
  logs: async (params: SmsLogsQuery = {}): Promise<SmsLogsResponse> => {
    const { data } = await client.get('/sms/logs', { params })
    return data
  },
}
