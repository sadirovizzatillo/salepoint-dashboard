interface StatusBadgeProps {
  status: string
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  ACTIVE: { label: 'Faol', color: '#059669', bg: '#ecfdf5' },
  INACTIVE: { label: 'Nofaol', color: '#94a3b8', bg: '#f1f5f9' },
  PAID: { label: "To'langan", color: '#059669', bg: '#ecfdf5' },
  PENDING: { label: 'Kutilmoqda', color: '#d97706', bg: '#fffbeb' },
  CANCELLED: { label: 'Bekor qilingan', color: '#dc2626', bg: '#fef2f2' },
  REFUNDED: { label: 'Qaytarilgan', color: '#7c3aed', bg: '#f5f3ff' },
  SUSPENDED: { label: "To'xtatilgan", color: '#dc2626', bg: '#fef2f2' },
  EXPIRED: { label: "Muddati o'tgan", color: '#d97706', bg: '#fffbeb' },
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = statusMap[status] ?? { label: status, color: '#64748b', bg: '#f1f5f9' }
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  )
}
