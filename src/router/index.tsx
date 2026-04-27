import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/auth/LoginPage'
import ShopSelectPage from '@/pages/auth/ShopSelectPage'
import DashboardPage from '@/pages/dashboard/DashboardPage'
import ProductsPage from '@/pages/products/ProductsPage'
import CategoriesPage from '@/pages/categories/CategoriesPage'
import CustomersPage from '@/pages/customers/CustomersPage'
import CustomerDebtsPage from '@/pages/customers/CustomerDebtsPage'
import OrdersPage from '@/pages/orders/OrdersPage'
import WarehousePage from '@/pages/warehouse/WarehousePage'
import TransactionsPage from '@/pages/transactions/TransactionsPage'
import EmployeesPage from '@/pages/employees/EmployeesPage'
import ShopsPage from '@/pages/shops/ShopsPage'
import DebtsPage from '@/pages/debts/DebtsPage'
import ShiftsPage from '@/pages/shifts/ShiftsPage'

const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

const PublicRoute = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/select-shop', element: <ShopSelectPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/products', element: <ProductsPage /> },
          { path: '/categories', element: <CategoriesPage /> },
          { path: '/customers', element: <CustomersPage /> },
          { path: '/customer/debts/:id', element: <CustomerDebtsPage /> },
          { path: '/orders', element: <OrdersPage /> },
          { path: '/warehouse', element: <WarehousePage /> },
          { path: '/transactions', element: <TransactionsPage /> },
          { path: '/employees', element: <EmployeesPage /> },
          { path: '/shops', element: <ShopsPage /> },
          { path: '/debts', element: <DebtsPage /> },
          { path: '/shifts', element: <ShiftsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
