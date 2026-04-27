import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider, App as AntApp } from 'antd'
import uzUZ from 'antd/locale/uz_UZ'
import { router } from '@/router'
import { antdTheme } from '@/styles/theme'
import { useAuthStore } from '@/store'
import '@/styles/global.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
      refetchOnWindowFocus: false,
    },
  },
})

// Hydrate auth from localStorage before render
useAuthStore.getState().hydrateFromStorage()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme} locale={uzUZ}>
        <AntApp>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
