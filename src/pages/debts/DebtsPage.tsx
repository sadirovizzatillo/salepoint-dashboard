import { useState } from 'react'
import {
  Table, Input, Typography, Tooltip, Button, Tag, Empty, Modal,
} from 'antd'
import {
  SearchOutlined,
  PhoneOutlined,
  MessageOutlined,
  ClockCircleOutlined,
  SendOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { useDebtsSummary, useSendSmsReminder } from '@/hooks/useDebts'
import { useAuthStore } from '@/store'
import PageHeader from '@/components/common/PageHeader'
import { DebtSummaryItem } from '@/types/debt.types'
import { formatDate, formatCurrency, formatPhone } from '@/utils/formatters'

const { Text } = Typography

function parseJwt(token: string) {
  try { return JSON.parse(atob(token.split('.')[1])) } catch { return {} }
}

function buildSmsText(customerName: string, shopName: string, totalRemaining: number, debtCount: number) {
  const amount = formatCurrency(totalRemaining)
  const countPart = debtCount > 1 ? ` (${debtCount} ta qarz)` : ''
  return `Hurmatli ${customerName}, "${shopName}" do'konidan jami ${amount} qarzingiz bor${countPart}. Iltimos, o'z vaqtida to'lang.`
}

interface SmsConfirmModalProps {
  open: boolean
  customer: DebtSummaryItem | null
  shopName: string
  onConfirm: () => void
  onCancel: () => void
  loading: boolean
}

function SmsConfirmModal({ open, customer, shopName, onConfirm, onCancel, loading }: SmsConfirmModalProps) {
  if (!customer) return null
  const smsText = buildSmsText(customer.customerName, shopName, customer.totalRemaining, customer.debtCount)

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={440}
      centered
      closable={!loading}
      maskClosable={!loading}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 8, paddingBottom: 20 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
            boxShadow: '0 4px 14px rgba(99,102,241,0.35)',
          }}
        >
          <MessageOutlined style={{ fontSize: 24, color: '#fff' }} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#0f172a' }}>SMS eslatma yuborish</div>
        <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
          {customer.customerName}
          {customer.phone && (
            <span style={{ marginLeft: 6, color: '#94a3b8' }}>· {formatPhone(customer.phone)}</span>
          )}
        </div>
      </div>

      {/* SMS bubble */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 20,
          position: 'relative',
        }}
      >
        <div style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', marginBottom: 8, textTransform: 'uppercase' }}>
          SMS matni
        </div>
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '12px 14px',
            fontSize: 13,
            color: '#1e293b',
            lineHeight: 1.6,
          }}
        >
          {smsText}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Qarz soni: <strong style={{ color: '#ef4444' }}>{customer.debtCount} ta</strong>
            </span>
            <span style={{ fontSize: 11, color: '#94a3b8' }}>
              Jami: <strong style={{ color: '#ef4444' }}>{formatCurrency(customer.totalRemaining)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <Button
          block
          onClick={onCancel}
          disabled={loading}
          style={{ borderRadius: 8 }}
        >
          Bekor qilish
        </Button>
        <Button
          block
          type="primary"
          icon={<SendOutlined />}
          loading={loading}
          onClick={onConfirm}
          style={{
            borderRadius: 8,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            border: 'none',
            fontWeight: 600,
          }}
        >
          Tasdiqlash
        </Button>
      </div>
    </Modal>
  )
}

export default function DebtsPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [smsTarget, setSmsTarget] = useState<DebtSummaryItem | null>(null)

  const { accessToken } = useAuthStore()
  const shopName = accessToken ? (parseJwt(accessToken).shopName ?? "Do'kon") : "Do'kon"

  const { data, isLoading, isFetching, refetch } = useDebtsSummary({ page, limit: 20, search })
  const sendSms = useSendSmsReminder()

  const handleConfirmSms = async () => {
    if (!smsTarget) return
    await sendSms.mutateAsync(smsTarget.customerId)
    setSmsTarget(null)
  }

  const columns = [
    {
      title: 'Mijoz',
      dataIndex: 'customerName',
      key: 'customerName',
      render: (v: string) => <Text style={{ fontWeight: 600, fontSize: 13 }}>{v}</Text>,
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#334155' }}>
          {v
            ? <><PhoneOutlined style={{ marginRight: 4, color: '#94a3b8' }} />{formatPhone(v)}</>
            : <span style={{ color: '#cbd5e1' }}>—</span>
          }
        </Text>
      ),
    },
    {
      title: 'Qarz soni',
      dataIndex: 'debtCount',
      key: 'debtCount',
      render: (v: number) => (
        <Tag color="red" style={{ fontWeight: 600 }}>{v} ta</Tag>
      ),
    },
    {
      title: 'Jami qoldiq',
      dataIndex: 'totalRemaining',
      key: 'totalRemaining',
      render: (v: number) => (
        <Text style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Eng qadimgi qarz',
      dataIndex: 'oldestDebtAt',
      key: 'oldestDebtAt',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#64748b' }}>
          <ClockCircleOutlined style={{ marginRight: 4 }} />
          {formatDate(v)}
        </Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 130,
      render: (_: any, record: DebtSummaryItem) => {
        const hasPhone = !!record.phone
        return (
          <Tooltip title={hasPhone ? 'SMS eslatma yuborish' : "Mijoz telefon raqami yo'q"}>
            <Button
              size="small"
              icon={<MessageOutlined />}
              disabled={!hasPhone}
              onClick={() => setSmsTarget(record)}
              style={{
                fontSize: 11,
                borderColor: hasPhone ? '#6366f1' : undefined,
                color: hasPhone ? '#6366f1' : undefined,
                borderRadius: 6,
              }}
            >
              SMS yuborish
            </Button>
          </Tooltip>
        )
      },
    },
  ]

  return (
    <div>
      <PageHeader
        title="Qarzdorlar"
        subtitle={`Jami: ${data?.meta?.total ?? 0} ta qarzdor mijoz`}
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
        }}
      >
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Mijoz ismi bo'yicha qidirish..."
          style={{ width: 300, borderRadius: 8 }}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          allowClear
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
        <Table<DebtSummaryItem>
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="customerId"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Qarzdorlar topilmadi" /> }}
          pagination={{
            current: page,
            pageSize: 20,
            total: data?.meta?.total,
            showTotal: (t) => `Jami ${t} ta`,
            onChange: setPage,
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      <SmsConfirmModal
        open={!!smsTarget}
        customer={smsTarget}
        shopName={shopName}
        onConfirm={handleConfirmSms}
        onCancel={() => setSmsTarget(null)}
        loading={sendSms.isPending}
      />
    </div>
  )
}
