import { ThemeConfig } from 'antd'

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#6366f1',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    borderRadius: 8,
    fontFamily:
      "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,
    colorBgContainer: '#ffffff',
    colorBgLayout: '#f8fafc',
    colorBorder: '#e2e8f0',
    colorBorderSecondary: '#f1f5f9',
    boxShadow: 'none',
    boxShadowSecondary: 'none',
  },
  components: {
    Layout: {
      siderBg: '#0f172a',
      triggerBg: '#1e293b',
      triggerColor: '#94a3b8',
    },
    Menu: {
      darkItemBg: '#0f172a',
      darkSubMenuItemBg: '#0f172a',
      darkItemSelectedBg: '#1e293b',
      darkItemColor: '#94a3b8',
      darkItemHoverColor: '#f1f5f9',
      darkItemSelectedColor: '#ffffff',
      itemBorderRadius: 6,
      itemMarginInline: 8,
    },
    Button: {
      borderRadius: 8,
      controlHeight: 38,
      paddingContentHorizontal: 18,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Select: {
      borderRadius: 8,
      controlHeight: 38,
    },
    Table: {
      borderRadius: 12,
      headerBg: '#f8fafc',
      headerColor: '#64748b',
      rowHoverBg: '#f8fafc',
    },
    Card: {
      borderRadius: 12,
      boxShadow: 'none',
    },
    Modal: {
      borderRadius: 16,
    },
    Tag: {
      borderRadius: 20,
    },
    Statistic: {
      titleFontSize: 13,
    },
  },
}
