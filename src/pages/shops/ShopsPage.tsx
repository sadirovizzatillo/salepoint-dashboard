import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Space, Typography,
  Tooltip, Tag, Empty,
} from 'antd'
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { useShops, useCreateShop, useUpdateShop } from '@/hooks/useShops'
import PageHeader from '@/components/common/PageHeader'
import { Shop, CreateShopRequest, UpdateShopRequest } from '@/types/shop.types'
import { SubscriptionStatus } from '@/types/common.types'
import { formatDate } from '@/utils/formatters'

const { Text } = Typography

const STATUS_CONFIG: Record<SubscriptionStatus, { label: string; color: string }> = {
  active: { label: 'Faol', color: 'green' },
  suspended: { label: "To'xtatilgan", color: 'red' },
  expired: { label: 'Muddati tugagan', color: 'orange' },
  trial: { label: 'Sinov', color: 'blue' },
}

export default function ShopsPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Shop | null>(null)
  const [form] = Form.useForm()

  const { data: shops, isLoading, isFetching, refetch } = useShops()
  const createMutation = useCreateShop()
  const updateMutation = useUpdateShop()

  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Shop) => {
    setEditing(record)
    form.setFieldsValue({
      name: record.name,
      address: record.address,
      phone: record.phone,
      email: record.email,
      logoUrl: record.logoUrl,
    })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateMutation.mutateAsync({ shopId: editing.id, body: values as UpdateShopRequest })
    } else {
      await createMutation.mutateAsync(values as CreateShopRequest)
    }
    setModalOpen(false)
  }

  const columns = [
    {
      title: '#',
      key: 'rowNumber',
      width: 50,
      align: 'center' as const,
      render: (_: unknown, __: unknown, i: number) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{i + 1}</Text>
      ),
    },
    {
      title: "Do'kon nomi",
      key: 'name',
      render: (_: unknown, record: Shop) => (
        <Space>
          {record.logoUrl && (
            <img
              src={record.logoUrl}
              alt={record.name}
              style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
            />
          )}
          <Text style={{ fontWeight: 500, fontSize: 13 }}>{record.name}</Text>
        </Space>
      ),
    },
    {
      title: 'Manzil',
      dataIndex: 'address',
      key: 'address',
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#334155' }}>{v || '—'}</Text>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#334155' }}>{v || '—'}</Text>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'subscriptionStatus',
      key: 'subscriptionStatus',
      render: (v: SubscriptionStatus) => {
        const cfg = STATUS_CONFIG[v] ?? { label: v, color: 'default' }
        return <Tag color={cfg.color}>{cfg.label}</Tag>
      },
    },
    {
      title: "Qo'shilgan",
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#64748b' }}>{formatDate(v)}</Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_: unknown, record: Shop) => (
        <Tooltip title="Tahrirlash">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{ color: '#64748b' }}
          />
        </Tooltip>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Do'konlar"
        subtitle={`Jami: ${shops?.length ?? 0} ta do'kon`}
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
              Do'kon qo'shish
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
          dataSource={shops ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Do'konlar topilmadi" /> }}
          pagination={false}
          size="middle"
        />
      </div>

      <Modal
        title={editing ? "Do'konni tahrirlash" : "Do'kon qo'shish"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editing ? 'Saqlash' : "Qo'shish"}
        cancelText="Bekor qilish"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Nomi"
            rules={[{ required: true, message: 'Nom kiriting' }]}
          >
            <Input placeholder="Mening do'konim" />
          </Form.Item>
          <Form.Item name="address" label="Manzil">
            <Input placeholder="Toshkent, Chilonzor..." />
          </Form.Item>
          <Form.Item name="phone" label="Telefon">
            <Input placeholder="+998901234567" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: 'email', message: "To'g'ri email kiriting" }]}
          >
            <Input placeholder="shop@example.com" />
          </Form.Item>
          <Form.Item name="logoUrl" label="Logo URL">
            <Input placeholder="https://..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
