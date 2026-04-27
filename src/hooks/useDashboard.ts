import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '@/api/dashboard.api'
import dayjs from 'dayjs'

export const DASHBOARD_KEY = 'dashboard'

export const useDashboardOverview = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, 'overview'],
    queryFn: () => dashboardApi.getOverview(),
    refetchInterval: 60_000, // refresh every minute
  })

export const useSalesTrend = (from: string, to: string) =>
  useQuery({
    queryKey: [DASHBOARD_KEY, 'sales-trend', from, to],
    queryFn: () => dashboardApi.getSalesTrend({ from, to }),
    enabled: !!from && !!to,
  })

export const useCashierPerformance = (from: string, to: string) =>
  useQuery({
    queryKey: [DASHBOARD_KEY, 'cashier-performance', from, to],
    queryFn: () => dashboardApi.getCashierPerformance({ from, to }),
    enabled: !!from && !!to,
  })

export const useDashboardLowStock = () =>
  useQuery({
    queryKey: [DASHBOARD_KEY, 'low-stock'],
    queryFn: () => dashboardApi.getLowStock(),
  })

export const useTopProducts = (from: string, to: string) =>
  useQuery({
    queryKey: [DASHBOARD_KEY, 'top-products', from, to],
    queryFn: () => dashboardApi.getTopProducts({ from, to }),
    enabled: !!from && !!to,
  })

// Helper to get default date range (last 30 days)
export const useDefaultDateRange = () => {
  const to = dayjs().format('YYYY-MM-DD')
  const from = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
  return { from, to }
}
