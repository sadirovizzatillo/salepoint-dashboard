import { useQuery, useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store'
import { Me } from '@/types/auth.types'

export const ME_KEY = 'me'

export const useMe = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery<Me>({
    queryKey: [ME_KEY],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export const useInvalidateMe = () => {
  const qc = useQueryClient()
  return () => qc.invalidateQueries({ queryKey: [ME_KEY] })
}
