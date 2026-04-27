import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const { Content } = Layout

export default function AppLayout() {
  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <Layout style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />
        <Content
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 28px',
            background: '#f8fafc',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
