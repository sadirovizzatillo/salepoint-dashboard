import { useState } from 'react'
import {
  Table,
  Button,
  InputNumber,
  Input,
  Modal,
  Form,
  Switch,
  Space,
  Tooltip,
  Empty,
  Tag,
  Row,
  Col,
  Select,
} from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { warehouseApi } from '@/api/warehouse.api'
import { productsApi } from '@/api/products.api'
import { message } from 'antd'
import PageHeader from '@/components/common/PageHeader'
import { WarehouseItem, AddStorageRequest, AdjustStockRequest } from '@/types/warehouse.types'
import { formatCurrency } from '@/utils/formatters'

export default function WarehousePage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [addModal, setAddModal] = useState(false)
  const [adjustModal, setAdjustModal] = useState<string | null>(null)
  const [addForm] = Form.useForm()
  const [adjustForm] = Form.useForm()

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['warehouse', page, limit],
    queryFn: () => warehouseApi.getWarehouse({ page, limit }),
  })

  const { data: productsData } = useQuery({
    queryKey: ['products', { limit: 100 }],
    queryFn: () => productsApi.list({ limit: 100 }),
  })
  const products = productsData?.data ?? []

  const addMutation = useMutation({
    mutationFn: (body: AddStorageRequest) => warehouseApi.addStorage(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warehouse'] })
      message.success("Mahsulot omborga qo'shildi")
      setAddModal(false)
      addForm.resetFields()
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })

  const adjustMutation = useMutation({
    mutationFn: (body: AdjustStockRequest) => warehouseApi.adjustStock(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['warehouse'] })
      message.success('Zahira yangilandi')
      setAdjustModal(null)
      adjustForm.resetFields()
    },
    onError: () => message.error('Xatolik yuz berdi'),
  })

  const openAdjust = (item: WarehouseItem) => {
    adjustForm.resetFields()
    adjustForm.setFieldsValue({ productId: item.productId, quantity: item.quantityOnHand })
    setAdjustModal(item.productId)
  }

  const pageOffset = (page - 1) * limit

  const columns = [
    {
      title: '#',
      key: 'rowNumber',
      width: 50,
      align: 'center' as const,
      render: (_: any, __: any, i: number) => (
        <span style={{ fontSize: 12, color: '#94a3b8' }}>{pageOffset + i + 1}</span>
      ),
    },
    {
      title: 'Mahsulot',
      key: 'product',
      render: (_: any, r: WarehouseItem) => (
        <div>
          <div style={{ fontWeight: 500, fontSize: 13 }}>{r.product.name}</div>
          <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>
            {r.product.sku}
          </div>
        </div>
      ),
    },
    {
      title: 'Kategoriya',
      key: 'category',
      render: (_: any, r: WarehouseItem) =>
        r.product.category ? (
          <Tag style={{ fontSize: 11, borderRadius: 20 }}>{r.product.category.name}</Tag>
        ) : (
          '—'
        ),
    },
    {
      title: 'Sotish narxi',
      key: 'price',
      align: 'center' as const,
      render: (_: any, r: WarehouseItem) => (
        <span style={{ fontWeight: 500, fontSize: 13 }}>{formatCurrency(r.product.price)}</span>
      ),
    },
    {
      title: 'Tannarx',
      key: 'price',
      align: 'center' as const,
      render: (_: any, r: WarehouseItem) => (
        <span style={{ fontWeight: 500, fontSize: 13 }}>{formatCurrency(r.product.price)}</span>
      ),
    },
    {
      title: 'Zahira',
      dataIndex: 'quantityOnHand',
      key: 'quantityOnHand',
      width: 100,
      align: 'center' as const,
      render: (v: number, r: WarehouseItem) => {
        const low = v <= r.reorderPoint
        return (
          <Tag
            color={low ? 'red' : 'green'}
            style={{ fontWeight: 600, minWidth: 40, textAlign: 'center' }}
          >
            {v}
          </Tag>
        )
      },
    },
    // {
    //   title: 'Band',
    //   dataIndex: 'quantityReserved',
    //   key: 'quantityReserved',
    //   width: 80,
    //   align: 'center' as const,
    //   render: (v: number) => <span style={{ fontSize: 13, color: '#64748b' }}>{v}</span>,
    // },
    {
      title: 'Min. chegara',
      dataIndex: 'reorderPoint',
      key: 'reorderPoint',
      width: 110,
      align: 'center' as const,
      render: (v: number) => <span style={{ fontSize: 13, color: '#64748b' }}>{v}</span>,
    },
    // {
    //   title: '',
    //   key: 'actions',
    //   width: 60,
    //   render: (_: any, record: WarehouseItem) => (
    //     <Tooltip title="Zahirani sozlash">
    //       <Button
    //         type="text"
    //         size="small"
    //         icon={<EditOutlined />}
    //         onClick={() => openAdjust(record)}
    //         style={{ color: '#64748b' }}
    //       />
    //     </Tooltip>
    //   ),
    // },
  ]

  return (
    <div>
      <PageHeader
        title="Ombor"
        subtitle={`Jami: ${data?.total ?? 0} ta pozitsiya`}
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
              onClick={() => {
                addForm.resetFields()
                setAddModal(true)
              }}
              style={{ borderRadius: 8, background: '#6366f1', border: 'none' }}
            >
              Omborga qo'shish
            </Button>
          </Space>
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
        <Table
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Ombor bo'sh" /> }}
          pagination={{
            current: page,
            pageSize: limit,
            total: data?.total,
            showSizeChanger: true,
            showTotal: t => `Jami ${t} ta`,
            onChange: (p, l) => {
              setPage(p)
              setLimit(l)
            },
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      {/* Add storage modal */}
      <Modal
        title="Omborga qo'shish"
        open={addModal}
        onCancel={() => setAddModal(false)}
        onOk={() => addForm.validateFields().then(v => addMutation.mutate(v))}
        okText="Qo'shish"
        cancelText="Bekor qilish"
        confirmLoading={addMutation.isPending}
        width={520}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={addForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="productId"
            label="Mahsulot"
            rules={[{ required: true, message: 'Mahsulot tanlang' }]}
          >
            <Select
              showSearch
              placeholder="Mahsulot tanlang yoki qidiring..."
              optionFilterProp="label"
              filterOption={(input, option) =>
                ((option?.label as string) ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={products.map((p: any) => ({
                value: p.id,
                label: `${p.name} (${p.sku})`,
              }))}
              allowClear
            />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="Miqdor"
                rules={[{ required: true, message: 'Miqdor kiriting' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="costPrice"
                label="Tannarxi"
                rules={[{ required: true, message: 'Tannarx kiriting' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item
                name="margin"
                label="Marja (%)"
                rules={[{ required: true, message: 'Marja kiriting' }]}
              >
                <InputNumber style={{ width: '100%' }} min={0} max={100} placeholder="0" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="syncProductPrice"
                label="Narxni yangilash"
                valuePropName="checked"
                initialValue={false}
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="notes" label="Izoh">
            <Input.TextArea rows={2} placeholder="Ixtiyoriy..." />
          </Form.Item>
        </Form>
      </Modal>

      {/* Adjust stock modal */}
      <Modal
        title="Zahirani sozlash"
        open={!!adjustModal}
        onCancel={() => setAdjustModal(null)}
        onOk={() => adjustForm.validateFields().then(v => adjustMutation.mutate(v))}
        okText="Saqlash"
        cancelText="Bekor qilish"
        confirmLoading={adjustMutation.isPending}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={adjustForm} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="productId" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="quantity"
            label="Yangi miqdor"
            rules={[{ required: true, message: 'Miqdor kiriting' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} placeholder="0" />
          </Form.Item>
          <Form.Item name="notes" label="Izoh">
            <Input.TextArea rows={2} placeholder="Ixtiyoriy..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
