import { SalesCategoryDto, TransactionDataPointDto } from '@/api/data-analysis/dashboard/res-dto'
import type { EChartsOption } from 'echarts'

import { CHART_COLORS } from '../constants'

/**
 * 获取交易趋势图配置
 */
export function getTransactionTrendOption(data: TransactionDataPointDto[]): EChartsOption {
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['交易金额', '订单数'],
      selectedMode: false // 切换图例时报错，暂时禁用图例交互
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(item => item.time)
    },
    yAxis: [
      {
        type: 'value',
        name: '交易金额',
        position: 'left',
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '订单数',
        position: 'right',
        axisLabel: {
          formatter: '{value} 单'
        }
      }
    ],
    series: [
      {
        name: '交易金额',
        type: 'line',
        data: data.map(item => item.amount),
        itemStyle: {
          color: CHART_COLORS.primary
        }
      },
      {
        name: '订单数',
        type: 'line',
        yAxisIndex: 1,
        data: data.map(item => item.orderCount),
        itemStyle: {
          color: CHART_COLORS.success
        }
      }
    ]
  }
}

/**
 * 获取销售分类图配置
 */
export function getSalesCategoryOption(data: SalesCategoryDto[]): EChartsOption {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}元 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '销售分类',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          name: item.name,
          value: item.amount
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }
}
