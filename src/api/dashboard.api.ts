import { dashboardClient } from './client'

export const dashboardApi = {
  getOverview: async () => {
    const { data } = await dashboardClient.get('/dashboard/overview')
    return data
  },

  getSalesTrend: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/dashboard/sales-trend', { params })
    return data
  },

  getCashierPerformance: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/dashboard/cashier-performance', { params })
    return data
  },

  getLowStock: async () => {
    const { data } = await dashboardClient.get('/dashboard/low-stock')
    return data
  },

  // Reports
  getSummary: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/reports/summary', { params })
    return data
  },

  getSalesByDay: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/reports/sales-by-day', { params })
    return data
  },

  getTopProducts: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/reports/top-products', { params })
    return data
  },

  getPaymentMethods: async (params: { from: string; to: string }) => {
    const { data } = await dashboardClient.get('/reports/payment-methods', { params })
    return data
  },
}
