import { useQuery } from '@tanstack/react-query'
import { smsApi } from '@/api/sms.api'
import { SmsLogsQuery } from '@/types/sms.types'

export const SMS_LOGS_KEY = 'sms-logs'

export const useSmsLogs = (params: SmsLogsQuery = {}) =>
  useQuery({
    queryKey: [SMS_LOGS_KEY, params],
    queryFn: () => smsApi.logs(params),
    placeholderData: (prev) => prev,
  })
