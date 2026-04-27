import { useState } from 'react'
import { Table, Select, DatePicker, Space, Typography, Empty, Tag, Button } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { useOrders } from '@/hooks/useOrders'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { OrderFilters, OrderStatus } from '@/types/order.types'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import dayjs, { Dayjs } from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { Text } = Typography

export default function OrdersPage() {
  const [filters, setFilters] = useState<OrderFilters>({ page: 1, limit: 10 })
  const { data, isLoading, isFetching, refetch } = useOrders(filters)

  const handleRangeChange = (_: any, dates: [string, string]) => {
    setFilters((f) => ({ ...f, from: dates[0] || undefined, to: dates[1] || undefined, page: 1 }))
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
      render: (v: string) => (
        <Text style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
          #{v.slice(-8).toUpperCase()}
        </Text>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#475569' }}>{formatDateTime(v)}</Text>
      ),
    },
    {
      title: 'Mijoz',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (v: string) => (
        <Text style={{ fontSize: 13 }}>{v || <span style={{ color: '#94a3b8' }}>Anonim</span>}</Text>
      ),
    },
    {
      title: 'Kassir',
      dataIndex: 'cashierName',
      key: 'cashierName',
      render: (v: string) => <Text style={{ fontSize: 12, color: '#64748b' }}>{v}</Text>,
    },
    {
      title: 'Mahsulotlar',
      dataIndex: 'items',
      key: 'items',
      render: (items: any[]) => (
        <Text style={{ fontSize: 12, color: '#64748b' }}>{items?.length ?? 0} ta</Text>
      ),
    },
    {
      title: 'Jami',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      render: (v: number) => (
        <Text style={{ fontWeight: 600, fontSize: 13, color: '#0f172a' }}>
          {formatCurrency(v)}
        </Text>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      render: (v: OrderStatus) => <StatusBadge status={v} />,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Buyurtmalar"
        subtitle={`Jami: ${data?.total ?? 0} ta buyurtma`}
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
          padding: '14px 16px',
          marginBottom: 16,
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Select
          placeholder="Holat"
          style={{ width: 160 }}
          allowClear
          onChange={(v) => setFilters((f) => ({ ...f, status: v, page: 1 }))}
        >
          <Option value="PENDING">Kutilmoqda</Option>
          <Option value="PAID">To'langan</Option>
          <Option value="CANCELLED">Bekor qilingan</Option>
          <Option value="REFUNDED">Qaytarilgan</Option>
        </Select>
        <RangePicker
          onChange={handleRangeChange}
          format="DD.MM.YYYY"
          style={{ borderRadius: 8 }}
          placeholder={['Boshlanish', 'Tugash']}
        />
      </div>

      <div
        style={{
          background: '#fff',
          border: '0.5px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Table
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Buyurtmalar topilmadi" /> }}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.total,
            showTotal: (t) => `Jami ${t} ta`,
            onChange: (page, limit) => setFilters((f) => ({ ...f, page, limit })),
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>
    </div>
  )
}
