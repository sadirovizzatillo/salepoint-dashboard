import { useState } from 'react'
import {
  Table, Button, Modal, Form, Input, Select, Space, Typography,
  Tooltip, Tag, Empty, Popconfirm,
} from 'antd'
import { PlusOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons'
import { useStaff, useCreateStaff, useRemoveStaff } from '@/hooks/useStaff'
import PageHeader from '@/components/common/PageHeader'
import { StaffMember, CreateStaffRequest, StaffRole } from '@/types/employee.types'
import { formatDate } from '@/utils/formatters'

const { Text } = Typography

const ROLE_LABELS: Record<StaffRole, string> = {
  admin: 'Admin',
  manager: 'Menejer',
  cashier: 'Kassir',
}

const ROLE_COLORS: Record<StaffRole, string> = {
  admin: 'red',
  manager: 'blue',
  cashier: 'green',
}

export default function EmployeesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const { data: staff, isLoading, isFetching, refetch } = useStaff()
  const createMutation = useCreateStaff()
  const removeMutation = useRemoveStaff()

  const openAdd = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    await createMutation.mutateAsync(values as CreateStaffRequest)
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
      title: 'Ism',
      key: 'name',
      render: (_: unknown, record: StaffMember) => (
        <Text style={{ fontWeight: 500, fontSize: 13 }}>{record.user.name}</Text>
      ),
    },
    {
      title: 'Email',
      key: 'email',
      render: (_: unknown, record: StaffMember) => (
        <Text style={{ fontSize: 13, color: '#334155' }}>{record.user.email}</Text>
      ),
    },
    {
      title: 'Rol',
      key: 'roles',
      render: (_: unknown, record: StaffMember) => (
        <Space size={4}>
          {record.roles.map((role) => (
            <Tag key={role} color={ROLE_COLORS[role]} style={{ fontSize: 12 }}>
              {ROLE_LABELS[role] ?? role}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Holat',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (v: boolean) => (
        <Tag color={v ? 'green' : 'default'}>{v ? 'Faol' : 'Nofaol'}</Tag>
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
      width: 60,
      render: (_: unknown, record: StaffMember) => (
        <Popconfirm
          title="Xodimni o'chirish"
          description="Haqiqatan ham ushbu xodimni olib tashlamoqchimisiz?"
          okText="Ha"
          cancelText="Yo'q"
          okButtonProps={{ danger: true }}
          onConfirm={() => removeMutation.mutate(record.userId)}
        >
          <Tooltip title="O'chirish">
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              style={{ color: '#ef4444' }}
              loading={removeMutation.isPending}
            />
          </Tooltip>
        </Popconfirm>
      ),
    },
  ]

  return (
    <div>
      <PageHeader
        title="Xodimlar"
        subtitle={`Jami: ${staff?.length ?? 0} ta xodim`}
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
              Xodim qo'shish
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
          dataSource={staff ?? []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          locale={{ emptyText: <Empty description="Xodimlar topilmadi" /> }}
          pagination={false}
          size="middle"
        />
      </div>

      <Modal
        title="Xodim qo'shish"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Qo'shish"
        cancelText="Bekor qilish"
        confirmLoading={createMutation.isPending}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Ism"
            rules={[{ required: true, message: 'Ism kiriting' }]}
          >
            <Input placeholder="Ali Karimov" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email kiriting' },
              { type: 'email', message: "To'g'ri email kiriting" },
            ]}
          >
            <Input placeholder="ali@myshop.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Parol"
            rules={[
              { required: true, message: 'Parol kiriting' },
              { min: 8, message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak" },
            ]}
          >
            <Input.Password placeholder="Kamida 8 ta belgi" />
          </Form.Item>
          <Form.Item
            name="roles"
            label="Rol"
            rules={[{ required: true, message: 'Rolni tanlang' }]}
          >
            <Select
              mode="multiple"
              placeholder="Rolni tanlang"
              options={[
                { value: 'cashier', label: 'Kassir' },
                { value: 'manager', label: 'Menejer' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
