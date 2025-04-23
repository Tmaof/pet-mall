/**
 * 图表颜色常量
 */
export const CHART_COLORS = {
  /** 主色调 */
  primary: '#409EFF',
  /** 成功色 */
  success: '#67C23A',
  /** 警告色 */
  warning: '#E6A23C',
  /** 危险色 */
  danger: '#F56C6C',
  /** 信息色 */
  info: '#909399'
}

/**
 * 库存状态配置
 */
export const STOCK_STATUS_CONFIG = {
  low: {
    label: '库存不足',
    color: 'var(--theme-danger)',
    icon: 'Warning'
  },
  excess: {
    label: '库存积压',
    color: 'var(--theme-warning)',
    icon: 'Warning'
  }
}

/**
 * 数据刷新间隔（毫秒）
 */
export const REFRESH_INTERVAL = 5 * 60 * 1000 // 5分钟
