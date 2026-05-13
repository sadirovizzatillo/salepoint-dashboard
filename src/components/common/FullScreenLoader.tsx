import { Spin } from 'antd'

export default function FullScreenLoader({ tip }: { tip?: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          background: '#6366f1',
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 700,
          fontSize: 22,
          boxShadow: '0 6px 20px rgba(99,102,241,0.35)',
        }}
      >
        Z
      </div>
      <Spin />
      {tip && <div style={{ fontSize: 13, color: '#64748b' }}>{tip}</div>}
    </div>
  )
}
