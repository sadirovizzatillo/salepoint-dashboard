import { useState } from 'react'
import { Avatar, Badge, Dropdown, Layout, Modal, Spin, Typography, message } from 'antd'
import {
  BellOutlined,
  LogoutOutlined,
  ShopOutlined,
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  CheckCircleFilled,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store'
import { useUiStore } from '@/store'
import { authApi } from '@/api/auth.api'
import { useShops } from '@/hooks/useShops'
import { useMe } from '@/hooks/useAuth'
import { Shop } from '@/types/shop.types'

const { Header } = Layout
const { Text } = Typography

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active: { label: 'Faol', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
  trial: { label: 'Sinov', color: '#6366f1', bg: '#eef2ff', border: '#c7d2fe' },
  suspended: { label: "To'xtatilgan", color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  expired: { label: 'Muddati tugagan', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}
const fallbackStatus = { label: "Noma'lum", color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }

export default function TopBar() {
  const navigate = useNavigate()
  const { logout, switchShop } = useAuthStore()
  const { sidebarCollapsed, toggleSidebar } = useUiStore()
  const { data: shops = [], isLoading: shopsLoading } = useShops()
  const { data: me } = useMe()
  const currentShopId = me?.shop?.id
  const currentShopName = me?.shop?.name

  const [modalOpen, setModalOpen] = useState(false)
  const [switching, setSwitching] = useState<string | null>(null)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      // ignore
    } finally {
      logout()
      navigate('/login')
    }
  }

  const handleSwitchShop = async (shop: Shop) => {
    const isActive = shop.subscriptionStatus === 'active'
    if (!isActive) return

    // Already on this shop
    if (shop.id === currentShopId) {
      setModalOpen(false)
      return
    }

    setSwitching(shop.id)
    try {
      await switchShop(shop.id)
      message.success(`${shop.name} — almashtirildi`)
      setModalOpen(false)
      navigate('/')
      window.location.reload()
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Xatolik yuz berdi')
    } finally {
      setSwitching(null)
    }
  }

  const menuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profil',
    },
    {
      key: 'switch-shop',
      icon: <ShopOutlined />,
      label: "Do'kon almashtirish",
      onClick: () => setModalOpen(true),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Chiqish',
      danger: true,
      onClick: handleLogout,
    },
  ]

  const initials = me?.name
    ? me.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <>
      <Header
        style={{
          background: '#ffffff',
          borderBottom: '1px solid #f1f5f9',
          height: 56,
          lineHeight: '56px',
          padding: '0 20px 0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          zIndex: 100,
          gap: 12,
        }}
      >
        {/* Left */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggleSidebar}
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              background: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </button>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Shop badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: 8,
              padding: '0 12px',
              height: 32,
              fontSize: 12,
              color: '#475569',
              fontWeight: 500,
              whiteSpace: 'nowrap',
            }}
          >
            <ShopOutlined style={{ fontSize: 12, color: '#6366f1' }} />
            {currentShopName || "Do'kon"}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />

          {/* Notifications */}
          <Badge count={0} showZero={false}>
            <button
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                background: '#f8fafc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                fontSize: 14,
                flexShrink: 0,
              }}
            >
              <BellOutlined />
            </button>
          </Badge>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 4px' }} />

          {/* User dropdown */}
          <Dropdown
            menu={{ items: menuItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                cursor: 'pointer',
                padding: '4px 8px 4px 4px',
                borderRadius: 8,
                border: '1px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f8fafc'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              <Avatar
                size={28}
                style={{
                  background: '#6366f1',
                  fontSize: 11,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {initials}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
                <Text
                  style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', maxWidth: 110 }}
                  ellipsis
                >
                  {me?.name || 'User'}
                </Text>
                <Text style={{ fontSize: 11, color: '#94a3b8' }}>
                  {me?.roles?.[0] ?? 'Foydalanuvchi'}
                </Text>
              </div>
            </div>
          </Dropdown>
        </div>
      </Header>

      {/* Shop switch modal */}
      <Modal
        open={modalOpen}
        onCancel={() => !switching && setModalOpen(false)}
        footer={null}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ShopOutlined style={{ color: '#6366f1' }} />
            <span>Do'kon almashtirish</span>
          </div>
        }
        width={400}
        styles={{ body: { paddingTop: 8 } }}
      >
        {shopsLoading ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <Spin />
          </div>
        ) : shops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
            Do'konlar topilmadi
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {shops.map(shop => {
              const isActive = shop.subscriptionStatus === 'active'
              const isCurrent = shop.id === currentShopId
              const isLoading = switching === shop.id
              const status = statusConfig[shop.subscriptionStatus] ?? fallbackStatus

              return (
                <button
                  key={shop.id}
                  onClick={() => handleSwitchShop(shop)}
                  disabled={!isActive || !!switching}
                  style={{
                    width: '100%',
                    background: isCurrent ? '#eef2ff' : isActive ? '#ffffff' : '#fafafa',
                    border: `1px solid ${isCurrent ? '#6366f1' : isActive ? '#e2e8f0' : '#f1f5f9'}`,
                    borderRadius: 10,
                    padding: '12px 14px',
                    cursor: isActive && !isCurrent ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    textAlign: 'left',
                    transition: 'all 0.15s',
                    opacity: !isActive ? 0.55 : 1,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      background: shop.logoUrl ? 'transparent' : '#eef2ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      overflow: 'hidden',
                    }}
                  >
                    {shop.logoUrl ? (
                      <img
                        src={shop.logoUrl}
                        alt={shop.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <ShopOutlined style={{ fontSize: 16, color: '#6366f1' }} />
                    )}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 2 }}
                    >
                      {shop.name}
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 20,
                        background: status.bg,
                        color: status.color,
                        border: `0.5px solid ${status.border}`,
                        fontWeight: 500,
                      }}
                    >
                      {status.label}
                    </span>
                  </div>

                  <div style={{ flexShrink: 0 }}>
                    {isLoading ? (
                      <Spin size="small" />
                    ) : isCurrent ? (
                      <CheckCircleFilled style={{ fontSize: 16, color: '#6366f1' }} />
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </Modal>
    </>
  )
}
