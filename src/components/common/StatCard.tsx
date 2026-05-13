import { Card, Skeleton } from 'antd'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  sub?: string
  icon?: ReactNode
  accentColor?: string
  loading?: boolean
}

export default function StatCard({
  label,
  value,
  sub,
  icon,
  accentColor = '#6366f1',
  loading = false,
}: StatCardProps) {
  return (
    <Card
      style={{
        borderRadius: 12,
        border: '0.5px solid #e2e8f0',
        background: '#ffffff',
      }}
      styles={{ body: { padding: '18px 20px' } }}
    >
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} title={{ width: '60%' }} />
      ) : (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 500 }}>{label}</span>
            {icon && (
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  background: `${accentColor}14`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: accentColor,
                  fontSize: 14,
                }}
              >
                {icon}
              </div>
            )}
          </div>
          <div style={{ fontSize: 22, fontWeight: 600, color: '#0f172a', lineHeight: 1.2 }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>{sub}</div>}
        </>
      )}
    </Card>
  )
}
