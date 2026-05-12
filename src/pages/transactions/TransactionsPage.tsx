import { useState } from 'react'
import {
  Table, Select, DatePicker, Input, Drawer, Descriptions,
  Typography, Empty, Tag, Divider, Spin, Button,
} from 'antd'
import {
  SearchOutlined, ShoppingCartOutlined, UserOutlined,
  CalendarOutlined, DollarOutlined, PhoneOutlined,
  StarOutlined, TrophyOutlined, ReloadOutlined,
} from '@ant-design/icons'
import { useOrders, useOrder } from '@/hooks/useOrders'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import { Order, OrderCashier, OrderCustomer, OrderItem, OrderFilters, OrderStatus } from '@/types/order.types'
import { formatCurrency, formatDateTime } from '@/utils/formatters'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker
const { Option } = Select
const { Text } = Typography

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'PENDING',   label: 'Kutilmoqda' },
  { value: 'PAID',      label: "To'langan" },
  { value: 'CANCELLED', label: 'Bekor qilingan' },
  { value: 'REFUNDED',  label: 'Qaytarilgan' },
]

const STATUS_COLORS: Record<OrderStatus, string> = {
  PAID:      '#059669',
  PENDING:   '#d97706',
  CANCELLED: '#dc2626',
  REFUNDED:  '#7c3aed',
}

function SummaryCard({ label, value, icon, color = '#6366f1' }: {
  label: string; value: string; icon: React.ReactNode; color?: string
}) {
  return (
    <div style={{
      flex: 1,
      minWidth: 160,
      background: '#fff',
      border: '0.5px solid #e2e8f0',
      borderRadius: 12,
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color, fontSize: 16, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>{value}</div>
      </div>
    </div>
  )
}

function CashierCard({ cashier }: { cashier: OrderCashier }) {
  const initials = cashier.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div style={{
      background: '#f0fdf4',
      border: '0.5px solid #bbf7d0',
      borderRadius: 10,
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
    }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8, background: '#dcfce7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#16a34a', fontSize: 11, fontWeight: 700, flexShrink: 0,
      }}>
        {cashier.avatarUrl
          ? <img src={cashier.avatarUrl} style={{ width: 30, height: 30, borderRadius: 8, objectFit: 'cover' }} />
          : initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{cashier.name}</div>
        <div style={{ fontSize: 11, color: '#64748b' }}>{cashier.email}</div>
      </div>
      <div style={{
        background: '#dcfce7', color: '#16a34a', borderRadius: 20,
        padding: '2px 8px', fontSize: 10, fontWeight: 600, whiteSpace: 'nowrap',
      }}>
        {cashier.roles[0] ?? 'Kassir'}
      </div>
    </div>
  )
}

function CustomerCard({ customer }: { customer: OrderCustomer }) {
  return (
    <div style={{
      background: '#f8fafc',
      border: '0.5px solid #e2e8f0',
      borderRadius: 10,
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8, background: '#e0e7ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6366f1', fontSize: 13,
          }}>
            <UserOutlined />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>{customer.name}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <PhoneOutlined style={{ fontSize: 10 }} /> {customer.phone}
            </div>
          </div>
        </div>
        <div style={{
          background: '#fef9c3', color: '#854d0e', borderRadius: 20,
          padding: '2px 8px', fontSize: 11, fontWeight: 600,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <StarOutlined style={{ fontSize: 10 }} /> {customer.loyaltyPoints}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 8, padding: '6px 10px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>Tashriflar</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a' }}>{customer.visitCount}</div>
        </div>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 8, padding: '6px 10px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 10, color: '#94a3b8' }}>Jami xarid</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>
            {Number(customer.totalSpent).toLocaleString()} so'm
          </div>
        </div>
      </div>
      {customer.notes && (
        <div style={{ fontSize: 11, color: '#64748b', fontStyle: 'italic' }}>
          "{customer.notes}"
        </div>
      )}
    </div>
  )
}

function OrderDrawer({ orderId, onClose }: { orderId: string; onClose: () => void }) {
  const { data: order, isLoading } = useOrder(orderId)

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, color: '#0f172a' }}>Tranzaksiya</span>
          {order && (
            <Text style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
              #{orderId.slice(-8).toUpperCase()}
            </Text>
          )}
        </div>
      }
      placement="right"
      width={460}
      open={!!orderId}
      onClose={onClose}
      styles={{ body: { padding: '16px 20px' } }}
    >
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
          <Spin />
        </div>
      ) : order ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Status + date */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            background: '#f8fafc', borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 12 }}>
              <CalendarOutlined />
              {formatDateTime(order.createdAt)}
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Customer card */}
          {order.customer ? (
            <CustomerCard customer={order.customer} />
          ) : (
            <div style={{
              background: '#f8fafc', borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <UserOutlined style={{ color: '#94a3b8', fontSize: 13 }} />
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Mijoz</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#94a3b8' }}>Anonim</div>
              </div>
            </div>
          )}

          {/* Cashier */}
          {order.cashier ? (
            <CashierCard cashier={order.cashier} />
          ) : (
            <div style={{
              background: '#f8fafc', borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <UserOutlined style={{ color: '#10b981', fontSize: 13 }} />
              <div>
                <div style={{ fontSize: 10, color: '#94a3b8' }}>Kassir</div>
                <div style={{ fontSize: 12, fontWeight: 500, color: '#0f172a' }}>
                  {order.cashierName || '—'}
                </div>
              </div>
            </div>
          )}

          {/* Items */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Mahsulotlar
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(order.items ?? []).map((item) => (
                <div key={item.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#f8fafc', borderRadius: 8, padding: '8px 12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, background: '#e0e7ff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#6366f1',
                    }}>
                      {item.quantity}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#0f172a' }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8' }}>
                        {formatCurrency(Number(item.price))} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a' }}>
                    {formatCurrency(Number(item.lineTotal))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ margin: '4px 0' }} />

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#64748b' }}>Oraliq summa</Text>
              <Text style={{ fontSize: 12, color: '#0f172a' }}>{formatCurrency(order.subtotal)}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 12, color: '#64748b' }}>Soliq</Text>
              <Text style={{ fontSize: 12, color: '#0f172a' }}>{formatCurrency(order.tax)}</Text>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              background: '#f0fdf4', borderRadius: 8, padding: '10px 12px', marginTop: 4,
            }}>
              <Text style={{ fontSize: 13, fontWeight: 600, color: '#059669' }}>Jami</Text>
              <Text style={{ fontSize: 14, fontWeight: 700, color: '#059669' }}>
                {formatCurrency(order.total)}
              </Text>
            </div>
          </div>
        </div>
      ) : null}
    </Drawer>
  )
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<OrderFilters>({ page: 1, limit: 20 })
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { data, isLoading, isFetching, refetch } = useOrders(filters)

  const orders = data?.data ?? []
  const total = data?.total ?? 0
  const totalRevenue = orders
    .filter((o) => o.status === 'PAID')
    .reduce((sum, o) => sum + o.total, 0)
  const paidCount = orders.filter((o) => o.status === 'PAID').length
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length

  const pageOffset = ((filters.page ?? 1) - 1) * (filters.limit ?? 20)

  const columns = [
    {
      title: '#',
      key: 'rowNumber',
      width: 50,
      align: 'center' as const,
      render: (_: any, __: any, i: number) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{pageOffset + i + 1}</Text>
      ),
    },
    {
      title: 'Tranzaksiya',
      dataIndex: 'id',
      key: 'id',
      width: 130,
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
      width: 140,
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#475569' }}>{formatDateTime(v)}</Text>
      ),
    },
    {
      title: 'Kassir',
      key: 'cashierName',
      render: (_: any, r: Order) => {
        const name = r.cashier?.name || r.cashierName
        return <Text style={{ fontSize: 12, color: '#374151' }}>{name || '—'}</Text>
      },
    },
    {
      title: 'Mijoz',
      key: 'customerName',
      render: (_: any, r: Order) => {
        const name = r.customer?.name || r.customerName
        return name
          ? <Text style={{ fontSize: 12 }}>{name}</Text>
          : <Text style={{ fontSize: 12, color: '#cbd5e1' }}>Anonim</Text>
      },
    },
    {
      title: 'Mahsulotlar',
      dataIndex: 'items',
      key: 'items',
      width: 100,
      align: 'center' as const,
      render: (items: OrderItem[]) => (
        <Tag style={{ borderRadius: 20, fontSize: 11 }}>{items?.length ?? 0} ta</Tag>
      ),
    },
    {
      title: 'Jami',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      render: (v: number, r: Order) => (
        <Text style={{
          fontWeight: 700,
          fontSize: 13,
          color: STATUS_COLORS[r.status] ?? '#0f172a',
        }}>
          {formatCurrency(v)}
        </Text>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (v: OrderStatus) => <StatusBadge status={v} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader
        title="Tranzaksiyalar"
        subtitle={`Jami: ${total} ta tranzaksiya`}
        extra={
          <Button
            icon={<ReloadOutlined />}
            loading={isFetching}
            onClick={() => refetch()}
            style={{ borderRadius: 8 }}
          />
        }
      />

      {/* Summary cards */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SummaryCard
          label="Sahifadagi tushum"
          value={formatCurrency(totalRevenue)}
          icon={<DollarOutlined />}
          color="#059669"
        />
        <SummaryCard
          label="To'langan"
          value={`${paidCount} ta`}
          icon={<ShoppingCartOutlined />}
          color="#6366f1"
        />
        <SummaryCard
          label="Kutilmoqda"
          value={`${pendingCount} ta`}
          icon={<CalendarOutlined />}
          color="#d97706"
        />
      </div>

      {/* Filters */}
      <div style={{
        background: '#fff',
        border: '0.5px solid #e2e8f0',
        borderRadius: 12,
        padding: '12px 16px',
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}>
        <Select
          placeholder="Holat"
          style={{ width: 160 }}
          allowClear
          onChange={(v) => setFilters((f) => ({ ...f, status: v, page: 1 }))}
        >
          {STATUS_OPTIONS.map((s) => (
            <Option key={s.value} value={s.value}>{s.label}</Option>
          ))}
        </Select>
        <RangePicker
          onChange={(_, dates) =>
            setFilters((f) => ({ ...f, from: dates[0] || undefined, to: dates[1] || undefined, page: 1 }))
          }
          format="DD.MM.YYYY"
          style={{ borderRadius: 8 }}
          placeholder={['Boshlanish', 'Tugash']}
          presets={[
            { label: 'Bugun', value: [dayjs(), dayjs()] },
            { label: 'Bu hafta', value: [dayjs().startOf('week'), dayjs()] },
            { label: 'Bu oy', value: [dayjs().startOf('month'), dayjs()] },
          ]}
        />
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Kassir ID..."
          style={{ width: 200, borderRadius: 8 }}
          allowClear
          onChange={(e) =>
            setFilters((f) => ({ ...f, cashierId: e.target.value || undefined, page: 1 }))
          }
        />
      </div>

      {/* Table */}
      <div style={{
        background: '#fff',
        border: '0.5px solid #e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <Table
          dataSource={orders}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Tranzaksiyalar topilmadi" /> }}
          onRow={(record) => ({
            onClick: () => setSelectedId(record.id),
            style: { cursor: 'pointer' },
          })}
          rowClassName={() => 'transaction-row'}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total,
            showSizeChanger: true,
            showTotal: (t) => `Jami ${t} ta`,
            onChange: (page, limit) => setFilters((f) => ({ ...f, page, limit })),
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      {/* Detail drawer */}
      {selectedId && (
        <OrderDrawer orderId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}
