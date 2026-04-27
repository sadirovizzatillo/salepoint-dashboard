import { useState } from 'react'
import {
  Table, Button, Input, Modal, Form, Space, Typography,
  Tooltip, Empty,
} from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, EyeOutlined, ReloadOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useCustomers, useCreateCustomer, useUpdateCustomer } from '@/hooks/useCustomers'
import PageHeader from '@/components/common/PageHeader'
import { Customer, CreateCustomerRequest } from '@/types/customer.types'
import { formatPhone, formatDate } from '@/utils/formatters'

const { Text } = Typography

export default function CustomersPage() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form] = Form.useForm()
  const navigate = useNavigate()

  const { data, isLoading, isFetching, refetch } = useCustomers({ page, limit: 10, search })
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()

  const openAdd = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (record: Customer) => {
    setEditing(record)
    form.setFieldsValue(record)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: values })
    } else {
      await createMutation.mutateAsync(values as CreateCustomerRequest)
    }
    setModalOpen(false)
  }

  const columns = [
    {
      title: 'Ism',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <Text style={{ fontWeight: 500, fontSize: 13 }}>{v}</Text>
      ),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      render: (v: string) => (
        <Text style={{ fontSize: 13, color: '#334155' }}>{formatPhone(v)}</Text>
      ),
    },
    {
      title: 'Izoh',
      dataIndex: 'notes',
      key: 'notes',
      render: (v: string) => (
        <Text style={{ fontSize: 12, color: '#94a3b8' }}>{v || '—'}</Text>
      ),
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
      width: 80,
      render: (_: any, record: Customer) => (
        <Space size={4}>
          <Tooltip title="Qarzlarni ko'rish">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/customer/debts/${record.id}`)}
              style={{ color: '#6366f1' }}
            />
          </Tooltip>
          <Tooltip title="Tahrirlash">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => openEdit(record)}
              style={{ color: '#64748b' }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Mijozlar"
        subtitle={`Jami: ${data?.total ?? 0} ta mijoz`}
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
              Mijoz qo'shish
            </Button>
          </Space>
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
          placeholder="Ism yoki telefon raqam..."
          style={{ width: 280, borderRadius: 8 }}
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
        <Table
          dataSource={data?.data ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Mijozlar topilmadi" /> }}
          pagination={{
            current: page,
            pageSize: 10,
            total: data?.total,
            showTotal: (t) => `Jami ${t} ta`,
            onChange: setPage,
            style: { padding: '12px 16px' },
          }}
          size="middle"
        />
      </div>

      <Modal
        title={editing ? 'Mijozni tahrirlash' : "Mijoz qo'shish"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText={editing ? 'Saqlash' : "Qo'shish"}
        cancelText="Bekor qilish"
        confirmLoading={createMutation.isPending || updateMutation.isPending}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Ism" rules={[{ required: true, message: 'Ism kiriting' }]}>
            <Input placeholder="Jane Smith" />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Telefon"
            rules={[{ required: true, message: 'Telefon kiriting' }]}
          >
            <Input placeholder="+998901234567" />
          </Form.Item>
          <Form.Item name="notes" label="Izoh">
            <Input.TextArea rows={2} placeholder="Ixtiyoriy..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
