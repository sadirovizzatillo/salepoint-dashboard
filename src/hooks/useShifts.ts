import { useQuery } from '@tanstack/react-query'
import { shiftsApi } from '@/api/shifts.api'

export const SHIFTS_KEY = 'shifts'

export const useShifts = () =>
  useQuery({
    queryKey: [SHIFTS_KEY],
    queryFn: shiftsApi.list,
  })
