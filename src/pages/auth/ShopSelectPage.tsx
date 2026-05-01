import { useState, useEffect } from 'react'
import { Alert, Button, Typography, Tag, Spin, message } from 'antd'
import { ShopOutlined, CheckCircleFilled, ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store'
import { ShopOption } from '@/types/auth.types'
import { ME_KEY } from '@/hooks/useAuth'

const { Title, Text } = Typography

const statusConfig = {
  ACTIVE: { label: 'Faol', color: '#10b981', bg: '#f0fdf4', border: '#a7f3d0' },
  SUSPENDED: { label: "To'xtatilgan", color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  EXPIRED: { label: 'Muddati tugagan', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
}

export default function ShopSelectPage() {
  const navigate = useNavigate()
  const { preAuthToken, shops, setTokens, clearPreAuth } = useAuthStore()
  const qc = useQueryClient()

  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Guard: if no preAuthToken, go back to login
  useEffect(() => {
    if (!preAuthToken) navigate('/login', { replace: true })
  }, [preAuthToken, navigate])

  const handleSelectShop = async (shop: ShopOption) => {
    if (shop.subscriptionStatus !== 'active') return

    setLoading(shop.id)
    setError(null)
    try {
      const tokens = await authApi.selectShop({ shopId: shop.id }, preAuthToken!)
      setTokens(tokens.accessToken, tokens.refreshToken)
      qc.removeQueries({ queryKey: [ME_KEY] })
      message.success(`${shop.name} — tizimga kirdingiz`)
      navigate('/')
    } catch (err: any) {
      const msg = err?.response?.data?.message
      if (msg === 'Faol smena tiklandi') {
        message.info('Faol smena tiklandi')
        const tokens = err?.response?.data
        if (tokens?.accessToken) {
          setTokens(tokens.accessToken, tokens.refreshToken)
          qc.removeQueries({ queryKey: [ME_KEY] })
          navigate('/')
          return
        }
      }
      setError(msg || 'Xatolik yuz berdi. Qayta urinib ko\'ring.')
    } finally {
      setLoading(null)
    }
  }

  const handleBack = () => {
    clearPreAuth()
    navigate('/login')
  }

  if (!preAuthToken) return null

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ position: 'fixed', top: -120, right: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#ffffff',
          borderRadius: 16,
          border: '0.5px solid #e2e8f0',
          padding: '40px 36px',
        }}
      >
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            padding: 0,
            marginBottom: 24,
          }}
        >
          <ArrowLeftOutlined /> Orqaga
        </button>

        <div style={{ marginBottom: 28 }}>
          <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>
            Do'kon tanlang
          </Title>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            Davom etish uchun do'konni tanlang
          </Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
            closable
            onClose={() => setError(null)}
          />
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {shops.map((shop) => {
            const status = statusConfig[shop.subscriptionStatus as keyof typeof statusConfig]
              ?? { label: shop.subscriptionStatus, color: '#64748b', bg: '#f8fafc', border: '#e2e8f0' }
            const isActive = shop.subscriptionStatus === 'active'
            const isLoading = loading === shop.id

            return (
              <button
                key={shop.id}
                onClick={() => handleSelectShop(shop)}
                disabled={!isActive || !!loading}
                style={{
                  width: '100%',
                  background: isActive ? '#ffffff' : '#fafafa',
                  border: `0.5px solid ${isActive ? '#e2e8f0' : '#f1f5f9'}`,
                  borderRadius: 12,
                  padding: '16px 20px',
                  cursor: isActive ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  opacity: !isActive ? 0.6 : 1,
                }}
                onMouseEnter={(e) => {
                  if (isActive) (e.currentTarget as HTMLElement).style.borderColor = '#6366f1'
                }}
                onMouseLeave={(e) => {
                  if (isActive) (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
                }}
              >
                {/* Shop icon / logo */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: shop.logoUrl ? 'transparent' : '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {shop.logoUrl ? (
                    <img src={shop.logoUrl} alt={shop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ShopOutlined style={{ fontSize: 20, color: '#6366f1' }} />
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>
                    {shop.name}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: 11,
                        padding: '1px 8px',
                        borderRadius: 20,
                        background: status.bg,
                        color: status.color,
                        border: `0.5px solid ${status.border}`,
                        fontWeight: 500,
                      }}
                    >
                      {status.label}
                    </span>
                    {shop.roles.map((r) => (
                      <Tag key={r} style={{ fontSize: 10, margin: 0 }}>{r}</Tag>
                    ))}
                  </div>
                </div>

                {/* Arrow or spinner */}
                <div style={{ color: '#94a3b8', flexShrink: 0 }}>
                  {isLoading ? (
                    <Spin size="small" />
                  ) : isActive ? (
                    <CheckCircleFilled style={{ fontSize: 18, color: '#e2e8f0' }} />
                  ) : null}
                </div>
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: '0.5px solid #f1f5f9', textAlign: 'center' }}>
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>
            ZPos v1.0 — Do'kon boshqaruv tizimi
          </Text>
        </div>
      </div>
    </div>
  )
}
