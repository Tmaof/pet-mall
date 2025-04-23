/**
 * 图表颜色配置
 */
export const CHART_COLORS = {
  /** 主色调 */
  primary: 'var(--theme-primary)',
  /** 成功色 */
  success: 'var(--theme-success)',
  /** 警告色 */
  warning: 'var(--theme-warning)',
  /** 危险色 */
  danger: 'var(--theme-danger)',
  /** 信息色 */
  info: 'var(--theme-info)'
}

/**
 * 图表主题配置
 */
export const CHART_THEME = {
  /** 背景色 */
  backgroundColor: 'transparent',
  /** 文字颜色 */
  textStyle: {
    color: 'var(--theme-text-primary)'
  },
  /** 提示框配置 */
  tooltip: {
    backgroundColor: 'var(--theme-bg-container)',
    borderColor: 'var(--theme-border-base)',
    textStyle: {
      color: 'var(--theme-text-primary)'
    }
  },
  /** 图例配置 */
  legend: {
    textStyle: {
      color: 'var(--theme-text-primary)'
    }
  },
  /** 坐标轴配置 */
  axisLine: {
    lineStyle: {
      color: 'var(--theme-border-base)'
    }
  },
  /** 坐标轴刻度配置 */
  axisTick: {
    lineStyle: {
      color: 'var(--theme-border-base)'
    }
  },
  /** 坐标轴标签配置 */
  axisLabel: {
    color: 'var(--theme-text-regular)'
  },
  /** 分割线配置 */
  splitLine: {
    lineStyle: {
      color: 'var(--theme-border-lighter)'
    }
  }
}
