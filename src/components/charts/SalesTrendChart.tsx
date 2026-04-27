import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { formatCurrency } from '@/utils/formatters'
import dayjs from 'dayjs'

interface DataPoint {
  period: string
  revenue?: number
  orders?: number
  [key: string]: any
}

interface SalesTrendChartProps {
  data: DataPoint[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: '#ffffff',
        border: '0.5px solid #e2e8f0',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: 12,
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
      }}
    >
      <p style={{ margin: '0 0 6px', color: '#64748b', fontWeight: 500 }}>
        {dayjs(label).format('DD MMM YYYY')}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ margin: '2px 0', color: p.color, fontWeight: 500 }}>
          {p.name}: {p.dataKey === 'revenue' ? formatCurrency(p.value) : p.value}
        </p>
      ))}
    </div>
  )
}

export default function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="period"
          tickFormatter={(d) => dayjs(d).format('DD MMM')}
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          yAxisId="revenue"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          width={44}
        />
        <YAxis
          yAxisId="orders"
          orientation="right"
          tick={{ fontSize: 11, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
          width={28}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          formatter={(v) => v === 'revenue' ? 'Tushum' : 'Buyurtmalar'}
        />
        <Area
          yAxisId="revenue"
          type="monotone"
          dataKey="revenue"
          name="revenue"
          stroke="#6366f1"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          yAxisId="orders"
          type="monotone"
          dataKey="orders"
          name="orders"
          stroke="#10b981"
          strokeWidth={2}
          fill="url(#colorOrders)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
