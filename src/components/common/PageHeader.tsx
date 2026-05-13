import { Typography } from 'antd'
import { ReactNode } from 'react'

const { Title } = Typography

interface PageHeaderProps {
  title: string
  subtitle?: string
  extra?: ReactNode
}

export default function PageHeader({ title, subtitle, extra }: PageHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: 24,
        flexWrap: 'wrap',
        gap: 12,
      }}
    >
      <div>
        <Title level={4} style={{ margin: 0, color: '#0f172a', fontWeight: 600, fontSize: 18 }}>
          {title}
        </Title>
        {subtitle && (
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: 13 }}>{subtitle}</p>
        )}
      </div>
      {extra && <div>{extra}</div>}
    </div>
  )
}
