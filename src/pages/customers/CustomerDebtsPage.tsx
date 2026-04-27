import { Table, Typography, Tag, Empty, Button, Space } from 'antd'
import { ArrowLeftOutlined, PhoneOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useDebts } from '@/hooks/useDebts'
import PageHeader from '@/components/common/PageHeader'
import { Debt } from '@/types/debt.types'
import { formatDate, formatCurrency, formatPhone } from '@/utils/formatters'

const { Text } = Typography

const statusLabel: Record<string, { text: string; color: string }> = {
  PENDING: { text: 'Kutilmoqda', color: 'orange' },
  PARTIAL: { text: "Qisman to'langan", color: 'blue' },
  PAID: { text: "To'langan", color: 'green' },
}

export default function CustomerDebtsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading, isFetching, refetch } = useDebts({ customerId: id })

  const debts = data?.data ?? []
  const first = debts[0]
  const customerName = first?.customerName ?? 'Mijoz'
  const customerPhone = first?.customerPhone

  const columns = [
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      render: (v: string) => <Text style={{ fontSize: 12 }}>{formatDate(v)}</Text>,
    },
    {
      title: 'Umumiy qarz',
      dataIndex: 'amount',
      render: (v: number) => (
        <Text style={{ fontSize: 12, fontWeight: 500 }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: "To'langan",
      dataIndex: 'paidAmount',
      render: (v: number) => (
        <Text style={{ fontSize: 12, color: '#10b981' }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Qoldiq',
      dataIndex: 'remainingAmount',
      render: (v: number) => (
        <Text style={{ fontSize: 12, color: '#ef4444', fontWeight: 600 }}>
          {formatCurrency(v)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (v: string) => {
        const s = statusLabel[v] ?? { text: v, color: 'default' }
        return <Tag color={s.color} style={{ fontSize: 11 }}>{s.text}</Tag>
      },
    },
    {
      title: 'Izoh',
      dataIndex: 'description',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{v || '—'}</Text>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title={customerName}
        subtitle={
          customerPhone
            ? `${formatPhone(customerPhone)} · ${debts.length} ta qarz`
            : `${debts.length} ta qarz`
        }
        extra={
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/customers')}
              style={{ borderRadius: 8 }}
            >
              Ortga
            </Button>
            <Button
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={() => refetch()}
              style={{ borderRadius: 8 }}
            />
            {customerPhone && (
              <Button
                icon={<PhoneOutlined />}
                href={`tel:${customerPhone}`}
                style={{ borderRadius: 8 }}
              >
                {formatPhone(customerPhone)}
              </Button>
            )}
          </Space>
        }
      />

      <div
        style={{
          background: '#fff',
          border: '0.5px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Table<Debt>
          dataSource={debts}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={false}
          size="middle"
          locale={{ emptyText: <Empty description="Qarzlar topilmadi" /> }}
        />
      </div>
    </div>
  )
}
