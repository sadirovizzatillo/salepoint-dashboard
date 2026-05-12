import { useMemo, useState, ReactNode } from 'react'
import {
  Table, Typography, Tag, Empty, Button, Select, DatePicker, Tooltip, Modal,
} from 'antd'
import {
  ReloadOutlined,
  MessageOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  SendOutlined,
  PhoneOutlined,
  EyeOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import PageHeader from '@/components/common/PageHeader'
import { useSmsLogs } from '@/hooks/useSms'
import { useStaff } from '@/hooks/useStaff'
import { useMe } from '@/hooks/useAuth'
import { SmsLog, SmsStatus } from '@/types/sms.types'
import { formatDateTime, formatPhone } from '@/utils/formatters'

const { Text, Paragraph } = Typography
const { RangePicker } = DatePicker

const STATUS_META: Record<SmsStatus, { color: string; label: string; icon: ReactNode }> = {
  pending:   { color: 'gold',   label: 'Kutilmoqda',   icon: <ClockCircleOutlined /> },
  sent:      { color: 'blue',   label: 'Yuborildi',    icon: <SendOutlined /> },
  delivered: { color: 'green',  label: 'Yetkazildi',   icon: <CheckCircleOutlined /> },
  failed:    { color: 'red',    label: 'Xato',         icon: <CloseCircleOutlined /> },
}

interface StatCardProps {
  label: string
  value: number
  color: string
  active?: boolean
  onClick?: () => void
}

function StatCard({ label, value, color, active, onClick }: StatCardProps) {
  return (
    <div
      onClick={onClick}
      style={{
        flex: 1,
        minWidth: 130,
        background: '#fff',
        border: `1px solid ${active ? color : '#e2e8f0'}`,
        borderRadius: 12,
        padding: '14px 16px',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.15s ease',
        boxShadow: active ? `0 0 0 3px ${color}20` : 'none',
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color, marginTop: 4 }}>
        {value.toLocaleString('uz-UZ')}
      </div>
    </div>
  )
}

export default function SmsLogsPage() {
  const { data: me } = useMe()
  const roles = me?.roles ?? []
  const ownUserId = me?.id ?? ''
  const canPickUser = roles.includes('SHOP_OWNER') || roles.includes('ADMIN')

  const [userId, setUserId] = useState<string>(canPickUser ? 'all' : ownUserId)
  const [status, setStatus] = useState<SmsStatus | undefined>(undefined)
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null] | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [preview, setPreview] = useState<SmsLog | null>(null)

  const { data: staffData } = useStaff()
  const staffList = canPickUser ? (staffData ?? []) : []

  const params = useMemo(() => {
    const p: Record<string, string | number> = { page, limit }
    if (canPickUser) {
      p.userId = userId
    } else if (ownUserId) {
      p.userId = ownUserId
    }
    if (status) p.status = status
    if (range?.[0]) p.from = range[0].toISOString()
    if (range?.[1]) p.to = range[1].toISOString()
    return p
  }, [userId, status, range, page, limit, canPickUser, ownUserId])

  const { data, isLoading, isFetching, refetch } = useSmsLogs(params)
  const totals = data?.totals
  const meta = data?.meta
  const rows = data?.data ?? []

  const userNameById = useMemo(() => {
    const map = new Map<string, string>()
    staffList.forEach((m) => map.set(m.userId, m.user?.name ?? m.user?.email ?? '—'))
    return map
  }, [staffList])

  const resetFilters = () => {
    setStatus(undefined)
    setRange(null)
    setUserId(canPickUser ? 'all' : ownUserId)
    setPage(1)
  }

  const onStatusCardClick = (s: SmsStatus | undefined) => {
    setStatus((prev) => (prev === s ? undefined : s))
    setPage(1)
  }

  const pageOffset = ((meta?.page ?? page) - 1) * (meta?.limit ?? limit)

  const columns = [
    {
      title: '#',
      key: 'rowNumber',
      width: 50,
      align: 'center' as const,
      render: (_: unknown, __: unknown, i: number) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{pageOffset + i + 1}</Text>
      ),
    },
    {
      title: 'Sana',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#475569' }}>{formatDateTime(v)}</Text>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      width: 170,
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#0f172a' }}>
          <PhoneOutlined style={{ marginRight: 4, color: '#94a3b8' }} />
          {formatPhone(v)}
        </Text>
      ),
    },
    {
      title: 'Matn',
      dataIndex: 'message',
      key: 'message',
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#334155' }} ellipsis={{ tooltip: v }}>
          {v}
        </Text>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (v: SmsStatus) => {
        const m = STATUS_META[v]
        return (
          <Tag color={m.color} icon={m.icon} style={{ fontWeight: 600, borderRadius: 6 }}>
            {m.label}
          </Tag>
        )
      },
    },
    {
      title: 'Yuboruvchi',
      dataIndex: 'sentByUserId',
      key: 'sentByUserId',
      width: 160,
      render: (v: string | null) => {
        if (!v) return <Text style={{ fontSize: 12, color: '#cbd5e1' }}>—</Text>
        const name = userNameById.get(v)
        return <Text style={{ fontSize: 12, color: '#475569' }}>{name ?? v.slice(0, 8)}</Text>
      },
    },
    {
      title: 'Urinish',
      dataIndex: 'attempts',
      key: 'attempts',
      width: 90,
      render: (v: number) => <Text style={{ fontSize: 12 }}>{v}</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: SmsLog) => (
        <Tooltip title="Batafsil">
          <Button
            size="small"
            type="text"
            icon={<EyeOutlined />}
            onClick={() => setPreview(record)}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="SMS log"
        subtitle={
          totals
            ? `Jami: ${totals.all.toLocaleString('uz-UZ')} ta SMS`
            : "Yuborilgan SMS xabarlar tarixi"
        }
        extra={
          <Button
            icon={<ReloadOutlined />}
            loading={isFetching}
            onClick={() => refetch()}
            style={{ borderRadius: 8 }}
          />
        }
      />

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <StatCard
          label="Jami"
          value={totals?.all ?? 0}
          color="#6366f1"
          active={status === undefined}
          onClick={() => onStatusCardClick(undefined)}
        />
        <StatCard
          label="Kutilmoqda"
          value={totals?.pending ?? 0}
          color="#d97706"
          active={status === 'pending'}
          onClick={() => onStatusCardClick('pending')}
        />
        <StatCard
          label="Yuborildi"
          value={totals?.sent ?? 0}
          color="#2563eb"
          active={status === 'sent'}
          onClick={() => onStatusCardClick('sent')}
        />
        <StatCard
          label="Yetkazildi"
          value={totals?.delivered ?? 0}
          color="#16a34a"
          active={status === 'delivered'}
          onClick={() => onStatusCardClick('delivered')}
        />
        <StatCard
          label="Xato"
          value={totals?.failed ?? 0}
          color="#dc2626"
          active={status === 'failed'}
          onClick={() => onStatusCardClick('failed')}
        />
      </div>

      {/* Filters */}
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
        {canPickUser && (
          <Select
            value={userId}
            onChange={(v) => { setUserId(v); setPage(1) }}
            style={{ minWidth: 200 }}
            placeholder="Xodim"
            options={[
              { value: 'all', label: 'Barcha xodimlar' },
              ...staffList.map((m) => ({
                value: m.userId,
                label: m.user?.name ?? m.user?.email ?? m.userId,
              })),
            ]}
          />
        )}
        <Select
          value={status}
          onChange={(v) => { setStatus(v); setPage(1) }}
          style={{ minWidth: 160 }}
          placeholder="Holat"
          allowClear
          options={(Object.keys(STATUS_META) as SmsStatus[]).map((s) => ({
            value: s,
            label: STATUS_META[s].label,
          }))}
        />
        <RangePicker
          value={range as [Dayjs, Dayjs] | null}
          onChange={(v) => { setRange(v as [Dayjs | null, Dayjs | null] | null); setPage(1) }}
          showTime={{ format: 'HH:mm' }}
          format="DD.MM.YYYY HH:mm"
          placeholder={['Boshlanish', 'Tugash']}
        />
        <Button onClick={resetFilters}>Tozalash</Button>
      </div>

      {/* Table */}
      <div
        style={{
          background: '#fff',
          border: '0.5px solid #e2e8f0',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <Table<SmsLog>
          dataSource={rows}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="SMS topilmadi" /> }}
          pagination={{
            current: meta?.page ?? page,
            pageSize: meta?.limit ?? limit,
            total: meta?.total ?? 0,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (t) => `Jami ${t} ta`,
            onChange: (p, ps) => {
              setPage(p)
              if (ps !== limit) setLimit(ps)
            },
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      {/* Detail modal */}
      <Modal
        open={!!preview}
        onCancel={() => setPreview(null)}
        footer={null}
        width={520}
        centered
        title={
          <span>
            <MessageOutlined style={{ marginRight: 8, color: '#6366f1' }} />
            SMS tafsilotlari
          </span>
        }
      >
        {preview && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <DetailRow label="Holat" value={
              <Tag
                color={STATUS_META[preview.status].color}
                icon={STATUS_META[preview.status].icon}
                style={{ fontWeight: 600 }}
              >
                {STATUS_META[preview.status].label}
              </Tag>
            } />
            <DetailRow label="Telefon" value={formatPhone(preview.phone)} />
            <DetailRow label="Yaratildi" value={formatDateTime(preview.createdAt)} />
            {preview.sentAt && <DetailRow label="Yuborildi" value={formatDateTime(preview.sentAt)} />}
            {preview.deliveredAt && <DetailRow label="Yetkazildi" value={formatDateTime(preview.deliveredAt)} />}
            {preview.failedAt && <DetailRow label="Xato vaqti" value={formatDateTime(preview.failedAt)} />}
            <DetailRow label="Provayder" value={`${preview.provider}${preview.providerSmsId ? ` · #${preview.providerSmsId}` : ''}`} />
            <DetailRow label="Urinish" value={String(preview.attempts)} />
            {preview.errorMessage && (
              <DetailRow label="Xato matni" value={
                <Text type="danger" style={{ fontSize: 12 }}>{preview.errorMessage}</Text>
              } />
            )}
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', marginBottom: 6 }}>
                Matn
              </div>
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 10,
                  padding: '12px 14px',
                  fontSize: 13,
                  color: '#1e293b',
                  lineHeight: 1.6,
                }}
              >
                <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{preview.message}</Paragraph>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
      <span style={{ fontSize: 13, color: '#0f172a', fontWeight: 500, textAlign: 'right' }}>{value}</span>
    </div>
  )
}
