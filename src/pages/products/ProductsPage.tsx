import { useState } from 'react'
import {
  Table, Button, Input, Select, Space, Tag, Modal, Form,
  InputNumber, Switch, Popconfirm, Tooltip, Row, Col, Empty, Image,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, EditOutlined,
  DeleteOutlined, BarcodeOutlined, ReloadOutlined, PictureOutlined, EyeOutlined,
} from '@ant-design/icons'
import {
  useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct,
} from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import PageHeader from '@/components/common/PageHeader'
import StatusBadge from '@/components/common/StatusBadge'
import ProductImageUploader from '@/components/common/ProductImageUploader'
import { Product, CreateProductRequest, ProductFilters } from '@/types/product.types'
import { formatCurrency } from '@/utils/formatters'

const { Option } = Select

export default function ProductsPage() {
  const [filters, setFilters] = useState<ProductFilters>({ page: 1, limit: 10 })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form] = Form.useForm()

  const { data, isLoading, isFetching, refetch } = useProducts(filters)
  const { data: categories } = useCategories()
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const deleteMutation = useDeleteProduct()

  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    form.setFieldsValue({ isActive: true, trackStock: true, taxRate: 0 })
    setModalOpen(true)
  }

  const openEdit = (record: Product) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: values })
    } else {
      await createMutation.mutateAsync(values as CreateProductRequest)
    }
    setModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const columns = [
    {
      title: '',
      key: 'image',
      width: 56,
      render: (_: unknown, r: Product) =>
        r.imageUrl ? (
          <Image
            src={r.imageUrl}
            alt={r.name}
            width={40}
            height={40}
            style={{ borderRadius: 8, objectFit: 'cover', cursor: 'zoom-in' }}
            preview={{
              mask: <EyeOutlined style={{ fontSize: 14 }} />,
            }}
          />
        ) : (
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PictureOutlined style={{ color: '#cbd5e1', fontSize: 16 }} />
          </div>
        ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 100,
      render: (v: string) => <span style={{ fontSize: 12, color: '#94a3b8', fontFamily: 'monospace' }}>{v}</span>,
    },
    {
      title: 'Mahsulot nomi',
      dataIndex: 'name',
      key: 'name',
      render: (v: string, r: Product) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{v}</div>
          {r.barcode && (
            <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
              <BarcodeOutlined style={{ fontSize: 10 }} /> {r.barcode}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Narxi',
      dataIndex: 'price',
      key: 'price',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontWeight: 500, fontSize: 13, color: '#0f172a' }}>
          {formatCurrency(v)}
        </span>
      ),
    },
    {
      title: 'Tannarxi',
      dataIndex: 'costPrice',
      key: 'costPrice',
      align: 'right' as const,
      render: (v: number) => (
        <span style={{ fontSize: 12, color: '#64748b' }}>{formatCurrency(v)}</span>
      ),
    },
    {
      title: 'Kategoriya',
      dataIndex: ['category', 'name'],
      key: 'categoryName',
      render: (v: string) =>
        v ? <Tag style={{ fontSize: 11, borderRadius: 20 }}>{v}</Tag> : '—',
    },
    {
      title: 'Holat',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 90,
      render: (v: boolean) => <StatusBadge status={v ? 'ACTIVE' : 'INACTIVE'} />,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: Product) => (
        <Space size={4}>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              style={{ color: '#64748b' }}
            />
          </Tooltip>
          <Popconfirm
            title="O'chirishni tasdiqlaysizmi?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="O'chirish">
              <Button
                type="text"
                size="small"
                icon={<DeleteOutlined />}
                style={{ color: '#ef4444' }}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Mahsulotlar"
        subtitle={`Jami: ${data?.total ?? 0} ta mahsulot`}
        extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              loading={isFetching}
              onClick={() => refetch()}
              style={{ borderRadius: 8 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openAdd}
              style={{ borderRadius: 8, background: '#6366f1', border: 'none' }}
            >
              Mahsulot qo'shish
            </Button>
          </Space>
        }
      />

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
        <Input
          prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
          placeholder="Mahsulot nomi yoki shtrix-kod..."
          style={{ width: 260, borderRadius: 8 }}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value, page: 1 }))
          }
          allowClear
        />
        <Select
          placeholder="Kategoriya"
          style={{ width: 180, borderRadius: 8 }}
          allowClear
          onChange={(v) => setFilters((f) => ({ ...f, categoryId: v, page: 1 }))}
        >
          {categories?.map((c) => (
            <Option key={c.id} value={c.id}>{c.name}</Option>
          ))}
        </Select>
        <Select
          placeholder="Holat"
          style={{ width: 130 }}
          allowClear
          onChange={(v) =>
            setFilters((f) => ({ ...f, active: v === undefined ? undefined : v === 'true', page: 1 }))
          }
        >
          <Option value="true">Faol</Option>
          <Option value="false">Nofaol</Option>
        </Select>
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
          locale={{ emptyText: <Empty description="Mahsulotlar topilmadi" /> }}
          pagination={{
            current: filters.page,
            pageSize: filters.limit,
            total: data?.total,
            showSizeChanger: true,
            showTotal: (t) => `Jami ${t} ta`,
            onChange: (page, limit) => setFilters((f) => ({ ...f, page, limit })),
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal
        title={editing ? 'Mahsulotni tahrirlash' : "Mahsulot qo'shish"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editing ? 'Saqlash' : "Qo'shish"}
        cancelText="Bekor qilish"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        width={560}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#475569', marginBottom: 8 }}>Rasm</div>
            <ProductImageUploader
              productId={editing?.id ?? null}
              imageUrl={editing?.imageUrl}
            />
          </div>

          <Row gutter={12}>
            <Col span={14}>
              <Form.Item name="name" label="Mahsulot nomi" rules={[{ required: true, message: 'Nom kiriting' }]}>
                <Input placeholder="Espresso" />
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="sku" label="SKU" rules={[{ required: true, message: 'SKU kiriting' }]}>
                <Input placeholder="ESP-001" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="price" label="Narxi (so'm)" rules={[{ required: true, message: 'Narx kiriting' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="costPrice" label="Tannarxi (so'm)" rules={[{ required: true, message: 'Tannarx kiriting' }]}>
                <InputNumber style={{ width: '100%' }} placeholder="0" min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="barcode" label="Shtrix-kod">
                <Input placeholder="1234567890" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="categoryId" label="Kategoriya">
                <Select placeholder="Tanlang" allowClear>
                  {categories?.map((c) => (
                    <Option key={c.id} value={c.id}>{c.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={12}>
            <Col span={8}>
              <Form.Item name="taxRate" label="Soliq (%)">
                <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="isActive" label="Faol" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="trackStock" label="Zahirani kuzat" valuePropName="checked">
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Tavsif">
            <Input.TextArea rows={2} placeholder="Ixtiyoriy..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
