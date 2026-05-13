import { useState } from 'react'
import {
  Row,
  Col,
  Card,
  DatePicker,
  Select,
  Table,
  Tag,
  Typography,
  Skeleton,
  Empty,
  Button,
  Space,
} from 'antd'
import {
  ShoppingOutlined,
  RiseOutlined,
  DollarOutlined,
  WarningOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import dayjs, { Dayjs } from 'dayjs'
import {
  useDashboardOverview,
  useSalesTrend,
  useTopProducts,
  useDashboardLowStock,
  useDefaultDateRange,
} from '@/hooks/useDashboard'
import StatCard from '@/components/common/StatCard'
import PageHeader from '@/components/common/PageHeader'
import SalesTrendChart from '@/components/charts/SalesTrendChart'
import { formatCurrency } from '@/utils/formatters'

const { RangePicker } = DatePicker
const { Text } = Typography

export default function DashboardPage() {
  const defaults = useDefaultDateRange()
  const [range, setRange] = useState<[string, string]>([defaults.from, defaults.to])

  const overviewQuery = useDashboardOverview()
  const trendQuery = useSalesTrend(range[0], range[1])
  const topProductsQuery = useTopProducts(range[0], range[1])
  const lowStockQuery = useDashboardLowStock()

  const { data: overview, isLoading: overviewLoading } = overviewQuery
  const { data: trend, isLoading: trendLoading } = trendQuery
  const { data: topProducts, isLoading: topLoading } = topProductsQuery
  const { data: lowStock } = lowStockQuery

  const isFetching =
    overviewQuery.isFetching ||
    trendQuery.isFetching ||
    topProductsQuery.isFetching ||
    lowStockQuery.isFetching

  const refetchAll = () => {
    overviewQuery.refetch()
    trendQuery.refetch()
    topProductsQuery.refetch()
    lowStockQuery.refetch()
  }

  const handleRangeChange = (_: any, dates: [string, string]) => {
    if (dates[0] && dates[1]) setRange(dates)
  }

  const topProductColumns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      width: 40,
      render: (_: any, __: any, i: number) => (
        <span style={{ color: '#94a3b8', fontSize: 12 }}>{i + 1}</span>
      ),
    },
    {
      title: 'Mahsulot',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: 'Sotildi',
      dataIndex: 'quantitySold',
      key: 'quantitySold',
      align: 'right' as const,
      render: (v: number) => <Text style={{ fontSize: 13 }}>{v} ta</Text>,
    },
    {
      title: 'Tushum',
      dataIndex: 'revenue',
      key: 'revenue',
      align: 'right' as const,
      render: (v: number) => (
        <Text style={{ fontSize: 13, color: '#6366f1', fontWeight: 500 }}>{formatCurrency(v)}</Text>
      ),
    },
  ]

  const lowStockColumns = [
    {
      title: 'Mahsulot',
      dataIndex: 'productName',
      key: 'productName',
      render: (v: string) => <Text style={{ fontSize: 13 }}>{v}</Text>,
    },
    {
      title: 'Qoldiq',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'right' as const,
      render: (v: number) => (
        <Tag color={v === 0 ? 'red' : 'orange'} style={{ fontSize: 11 }}>
          {v} ta
        </Tag>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle={`Bugun: ${dayjs().format('DD MMMM YYYY')}`}
        extra={
          <Space>
            <RangePicker
              defaultValue={[dayjs(range[0]), dayjs(range[1])] as [Dayjs, Dayjs]}
              onChange={handleRangeChange}
              format="DD.MM.YYYY"
              style={{ borderRadius: 8 }}
            />
            <Button
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={refetchAll}
              style={{ borderRadius: 8 }}
            />
          </Space>
        }
      />

      {/* KPI Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Umumiy tushum"
            value={overviewLoading ? '...' : formatCurrency(overview?.summary?.totalRevenue ?? 0)}
            sub={`Soliq: ${formatCurrency(overview?.summary?.totalTax ?? 0)}`}
            icon={<RiseOutlined />}
            accentColor="#6366f1"
            loading={overviewLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Buyurtmalar"
            value={overviewLoading ? '...' : `${overview?.summary?.totalOrders ?? 0} ta`}
            sub={`Chegirma: ${formatCurrency(overview?.summary?.totalDiscount ?? 0)}`}
            icon={<ShoppingOutlined />}
            accentColor="#10b981"
            loading={overviewLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="O'rtacha buyurtma"
            value={
              overviewLoading ? '...' : formatCurrency(overview?.summary?.averageOrderValue ?? 0)
            }
            icon={<DollarOutlined />}
            accentColor="#3b82f6"
            loading={overviewLoading}
          />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard
            label="Kam qolgan tovarlar"
            value={overviewLoading ? '...' : `${overview?.lowStockAlerts ?? 0} ta`}
            icon={<WarningOutlined />}
            accentColor="#f59e0b"
            loading={overviewLoading}
          />
        </Col>
      </Row>

      {/* Charts row */}
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col xs={24} lg={16}>
          <Card
            style={{ borderRadius: 12, border: '0.5px solid #e2e8f0' }}
            styles={{ body: { padding: '20px 20px 16px' } }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 20,
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>
                  Tushum va buyurtmalar
                </div>
                <div style={{ fontSize: 12, color: '#94a3b8' }}>
                  {range[0]} — {range[1]}
                </div>
              </div>
            </div>
            {trendLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : trend?.length ? (
              <SalesTrendChart data={trend} />
            ) : (
              <Empty description="Ma'lumot yo'q" style={{ padding: '40px 0' }} />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            style={{ borderRadius: 12, border: '0.5px solid #e2e8f0', height: '100%' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>
              Kam qolgan tovarlar
            </div>
            {lowStock?.length ? (
              <Table
                dataSource={lowStock}
                columns={lowStockColumns}
                rowKey="productId"
                pagination={false}
                size="small"
                showHeader={false}
                style={{ fontSize: 12 }}
              />
            ) : (
              <div
                style={{
                  textAlign: 'center',
                  padding: '24px 0',
                  color: '#94a3b8',
                  fontSize: 13,
                }}
              >
                <WarningOutlined
                  style={{ fontSize: 24, marginBottom: 8, display: 'block', color: '#e2e8f0' }}
                />
                Kam qolgan tovarlar yo'q
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Top products */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            style={{ borderRadius: 12, border: '0.5px solid #e2e8f0' }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, color: '#0f172a', marginBottom: 16 }}>
              Eng ko'p sotilgan mahsulotlar
            </div>
            {topLoading ? (
              <Skeleton active paragraph={{ rows: 5 }} />
            ) : (
              <Table
                dataSource={topProducts ?? []}
                columns={topProductColumns}
                rowKey="productId"
                pagination={false}
                size="middle"
                locale={{ emptyText: <Empty description="Ma'lumot yo'q" /> }}
                style={{ fontSize: 13 }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
