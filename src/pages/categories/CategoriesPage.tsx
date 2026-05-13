import { useState } from 'react'
import { Row, Col, Card, Button, Modal, Form, Input, Empty, Spin, Space } from 'antd'
import { PlusOutlined, AppstoreOutlined, ReloadOutlined } from '@ant-design/icons'
import { useCategories, useCreateCategory } from '@/hooks/useCategories'
import PageHeader from '@/components/common/PageHeader'
import { Category } from '@/types/category.types'

export default function CategoriesPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [form] = Form.useForm()

  const { data: categories, isLoading, isFetching, refetch } = useCategories()
  const createMutation = useCreateCategory()

  const handleCardClick = (item: Category) => {
    console.log(item)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    await createMutation.mutateAsync(values)
    setModalOpen(false)
    form.resetFields()
  }

  return (
    <div>
      <PageHeader
        title="Kategoriyalar"
        subtitle={`Jami: ${categories?.length ?? 0} ta kategoriya`}
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
              onClick={() => setModalOpen(true)}
              style={{ borderRadius: 8, background: '#6366f1', border: 'none' }}
            >
              Kategoriya qo'shish
            </Button>
          </Space>
        }
      />

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : categories?.length === 0 ? (
        <Empty description="Kategoriyalar topilmadi" style={{ padding: '60px 0' }} />
      ) : (
        <Row gutter={[16, 16]}>
          {categories?.map(cat => (
            <Col key={cat.id} xs={12} sm={8} md={6} lg={4} onClick={() => handleCardClick(cat)}>
              <Card
                hoverable
                style={{
                  borderRadius: 12,
                  border: '0.5px solid #e2e8f0',
                  textAlign: 'center',
                  cursor: 'default',
                }}
                styles={{ body: { padding: '20px 16px' } }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: cat.imageUrl ? 'transparent' : '#eef2ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px',
                    overflow: 'hidden',
                  }}
                >
                  {cat.imageUrl ? (
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <AppstoreOutlined style={{ fontSize: 22, color: '#6366f1' }} />
                  )}
                </div>
                <div style={{ fontWeight: 600, fontSize: 13, color: '#0f172a', marginBottom: 4 }}>
                  {cat.name}
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                  {cat.productCount ?? 0} ta mahsulot
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title="Kategoriya qo'shish"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false)
          form.resetFields()
        }}
        onOk={handleSubmit}
        okText="Qo'shish"
        cancelText="Bekor qilish"
        confirmLoading={createMutation.isPending}
        okButtonProps={{ style: { background: '#6366f1', border: 'none' } }}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Nomi" rules={[{ required: true, message: 'Nom kiriting' }]}>
            <Input placeholder="Masalan: Ichimliklar" />
          </Form.Item>
          <Form.Item name="description" label="Tavsif">
            <Input.TextArea rows={2} placeholder="Ixtiyoriy..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
