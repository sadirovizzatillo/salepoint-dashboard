import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppstoreOutlined,
  ShoppingOutlined,
  TagsOutlined,
  TeamOutlined,
  UserOutlined,
  FileTextOutlined,
  InboxOutlined,
  BarChartOutlined,
  SwapOutlined,
  ShopOutlined,
  AlertOutlined,
  FieldTimeOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import { useUiStore } from '@/store'

const { Sider } = Layout

const navItems = [
  {
    key: '/',
    icon: <AppstoreOutlined />,
    label: 'Dashboard',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'catalog',
    label: 'Katalog',
    type: 'group' as const,
    children: [
      { key: '/products', icon: <ShoppingOutlined />, label: 'Mahsulotlar' },
      { key: '/categories', icon: <TagsOutlined />, label: 'Kategoriyalar' },
      { key: '/warehouse', icon: <InboxOutlined />, label: 'Ombor' },
    ],
  },
  {
    key: 'management',
    label: 'Boshqaruv',
    type: 'group' as const,
    children: [
      { key: '/orders', icon: <FileTextOutlined />, label: 'Buyurtmalar' },
      { key: '/transactions', icon: <SwapOutlined />, label: 'Tranzaksiyalar' },
      { key: '/customers', icon: <UserOutlined />, label: 'Mijozlar' },
      { key: '/debts', icon: <AlertOutlined />, label: 'Qarzdorlar' },
      { key: '/sms-logs', icon: <MessageOutlined />, label: 'SMS log' },
      { key: '/shifts', icon: <FieldTimeOutlined />, label: 'Smenalar' },
      { key: '/employees', icon: <TeamOutlined />, label: 'Xodimlar' },
      { key: '/shops', icon: <ShopOutlined />, label: "Do'konlar" },
    ],
  },
  {
    key: 'reports',
    label: "Hisobotlar",
    type: 'group' as const,
    children: [
      { key: '/reports', icon: <BarChartOutlined />, label: 'Hisobot' },
    ],
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()

  return (
    <Sider
      collapsible
      collapsed={sidebarCollapsed}
      onCollapse={toggleSidebar}
      width={220}
      style={{
        background: '#0f172a',
        height: '100vh',
        overflow: 'auto',
        flexShrink: 0,
      }}
      trigger={null}
    >
      {/* Logo */}
      <div
        style={{
          height: 56,
          display: 'flex',
          alignItems: 'center',
          padding: sidebarCollapsed ? '0 24px' : '0 20px',
          borderBottom: '1px solid #1e293b',
          gap: 10,
          cursor: 'pointer',
        }}
        onClick={() => navigate('/')}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: '#6366f1',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          Z
        </div>
        {!sidebarCollapsed && (
          <span style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 16 }}>
            ZPos.
          </span>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={navItems}
        onClick={({ key }) => navigate(key)}
        style={{
          background: '#0f172a',
          border: 'none',
          marginTop: 8,
        }}
      />

    </Sider>
  )
}
