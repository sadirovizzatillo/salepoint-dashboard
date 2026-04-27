import { Table, Tag, Typography, Empty, Badge, Button } from 'antd'
import {
  UserOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useShifts } from '@/hooks/useShifts'
import PageHeader from '@/components/common/PageHeader'
import { Shift } from '@/types/shift.types'
import { formatCurrency, formatDateTime } from '@/utils/formatters'

const { Text } = Typography

function duration(openedAt: string, closedAt: string | null): string {
  const start = new Date(openedAt).getTime()
  const end = closedAt ? new Date(closedAt).getTime() : Date.now()
  const mins = Math.floor((end - start) / 60000)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h > 0 ? `${h}s ${m}d` : `${m}d`
}

export default function ShiftsPage() {
  const { data: shifts = [], isLoading, isFetching, refetch } = useShifts()

  const openCount = shifts.filter((s) => s.status === 'open').length

  const columns = [
    {
      title: 'Kassir',
      key: 'cashier',
      render: (_: any, r: Shift) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <UserOutlined style={{ fontSize: 13, color: '#6366f1' }} />
          </div>
          <Text style={{ fontWeight: 600, fontSize: 13 }}>{r.cashier.name}</Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v: string) =>
        v === 'open' ? (
          <Badge status="processing" text={<Text style={{ fontSize: 12, color: '#10b981', fontWeight: 600 }}>Ochiq</Text>} />
        ) : (
          <Badge status="default" text={<Text style={{ fontSize: 12, color: '#64748b' }}>Yopiq</Text>} />
        ),
    },
    {
      title: 'Ochilgan',
      dataIndex: 'openedAt',
      key: 'openedAt',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#334155' }}>
          <ClockCircleOutlined style={{ marginRight: 4, color: '#94a3b8' }} />
          {formatDateTime(v)}
        </Text>
      ),
    },
    {
      title: 'Yopilgan',
      dataIndex: 'closedAt',
      key: 'closedAt',
      render: (v: string | null) =>
        v ? (
          <Text style={{ fontSize: 12, color: '#334155' }}>{formatDateTime(v)}</Text>
        ) : (
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>—</Text>
        ),
    },
    {
      title: 'Davomiyligi',
      key: 'duration',
      render: (_: any, r: Shift) => (
        <Text style={{ fontSize: 12, color: '#475569' }}>{duration(r.openedAt, r.closedAt)}</Text>
      ),
    },
    {
      title: 'Naqd savdo',
      dataIndex: 'cashSales',
      key: 'cashSales',
      render: (v: number) => (
        <Text style={{ fontSize: 12 }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Karta savdo',
      dataIndex: 'cardSales',
      key: 'cardSales',
      render: (v: number) => (
        <Text style={{ fontSize: 12 }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Jami savdo',
      dataIndex: 'totalSales',
      key: 'totalSales',
      render: (v: number) => (
        <Text style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: (
        <span>
          <ShoppingCartOutlined style={{ marginRight: 4 }} />
          Buyurtma
        </span>
      ),
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (v: number) => (
        <Tag style={{ fontWeight: 600, fontSize: 12 }}>{v} ta</Tag>
      ),
    },
    {
      title: 'Boshlang\'ich kassa',
      dataIndex: 'openingFloat',
      key: 'openingFloat',
      render: (v: number) => (
        <Text style={{ fontSize: 12, color: '#64748b' }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Yakuniy kassa',
      dataIndex: 'closingFloat',
      key: 'closingFloat',
      render: (v: number | null) =>
        v != null ? (
          <Text style={{ fontSize: 12, color: '#64748b' }}>{formatCurrency(v)}</Text>
        ) : (
          <Text style={{ fontSize: 12, color: '#94a3b8' }}>—</Text>
        ),
    },
    {
      title: 'Izoh',
      dataIndex: 'notes',
      key: 'notes',
      render: (v: string | null) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{v || '—'}</Text>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Smenalar"
        subtitle={`So'nggi ${shifts.length} ta smena${openCount > 0 ? ` · ${openCount} ta ochiq` : ''}`}
        extra={
          <Button
            icon={<ReloadOutlined />}
            loading={isFetching}
            onClick={() => refetch()}
            style={{ borderRadius: 8 }}
          />
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
        <Table<Shift>
          dataSource={shifts}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Smenalar topilmadi" /> }}
          pagination={false}
          scroll={{ x: 1200 }}
          size="middle"
          rowClassName={(r) => r.status === 'open' ? 'shift-row-open' : ''}
        />
      </div>
    </div>
  )
}
