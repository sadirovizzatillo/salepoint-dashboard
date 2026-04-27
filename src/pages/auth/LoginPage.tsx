import { useState } from 'react'
import { Form, Input, Button, Alert, Typography } from 'antd'
import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { authApi } from '@/api/auth.api'
import { useAuthStore } from '@/store'
import { LoginRequest } from '@/types/auth.types'
import { SubscriptionStatus } from '@/types/common.types'

const { Title, Text } = Typography

export default function LoginPage() {
  const navigate = useNavigate()
  const setPreAuth = useAuthStore((s) => s.setPreAuth)
  const setTokens = useAuthStore((s) => s.setTokens)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFinish = async (values: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const res = await authApi.login(values)
      // If only one shop — auto-select it
      if (res.shops.length === 1) {
        const shop = res.shops[0]
        const validStatuses: SubscriptionStatus[] = ['active', 'trial']
        if (!validStatuses.includes(shop.subscriptionStatus)) {
          setError(
            shop.subscriptionStatus === 'EXPIRED'
              ? "Obuna muddati tugagan. Iltimos, obunani yangilang."
              : "Do'kon to'xtatilgan. Iltimos, qo'llab-quvvatlash bilan bog'laning."
          )
          return
        }
        const tokens = await authApi.selectShop(
          { shopId: shop.id },
          res.preAuthToken
        )
        setTokens(tokens.accessToken, tokens.refreshToken)
        navigate('/')
      } else {
        setPreAuth(res.preAuthToken, res.shops)
        navigate('/select-shop')
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || 'Email yoki parol noto\'g\'ri'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

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
      {/* Background decoration */}
      <div
        style={{
          position: 'fixed',
          top: -120,
          right: -120,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: -80,
          left: -80,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 16,
          border: '0.5px solid #e2e8f0',
          padding: '40px 36px',
          position: 'relative',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              background: '#6366f1',
              borderRadius: 12,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Z</span>
          </div>
          <Title level={3} style={{ margin: 0, color: '#0f172a', fontWeight: 600 }}>
            Xush kelibsiz
          </Title>
          <Text style={{ color: '#64748b', fontSize: 14 }}>
            Davom etish uchun tizimga kiring
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

        <Form
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label={<span style={{ color: '#374151', fontWeight: 500, fontSize: 13 }}>Email</span>}
            rules={[
              { required: true, message: 'Email kiriting' },
              { type: 'email', message: "To'g'ri email kiriting" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
              placeholder="owner@shop.com"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span style={{ color: '#374151', fontWeight: 500, fontSize: 13 }}>Parol</span>}
            rules={[{ required: true, message: 'Parol kiriting' }]}
            style={{ marginBottom: 24 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
              placeholder="••••••••"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: 44,
              borderRadius: 8,
              fontWeight: 600,
              fontSize: 15,
              background: '#6366f1',
              border: 'none',
            }}
          >
            Kirish
          </Button>
        </Form>

        <div
          style={{
            marginTop: 28,
            paddingTop: 20,
            borderTop: '0.5px solid #f1f5f9',
            textAlign: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>
            ZPos v1.0 — Do'kon boshqaruv tizimi
          </Text>
        </div>
      </div>
    </div>
  )
}
