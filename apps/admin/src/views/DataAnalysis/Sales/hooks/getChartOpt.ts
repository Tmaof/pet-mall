import type { CategorySalesDistributionDto, OrderStatusDistributionDto, PaymentMethodDistributionDto, RegionSalesDistributionDto, SalesTrendDataPointDto } from '@/api/data-analysis/sales/res-dto'
import type { EChartsOption } from 'echarts'
import { CHART_COLORS, CHART_THEME } from '../constants'
import { getEchartsMapName } from '@/utility/getEchartsMapName'

/**
 * 获取销售趋势图配置
 */
export function getSalesTrendOption(data: SalesTrendDataPointDto[]): EChartsOption {
  return {
    ...CHART_THEME,
    tooltip: {
      ...CHART_THEME.tooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      ...CHART_THEME.legend,
      data: ['销售额', '订单量']
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
      data: data.map(item => item.date)
    },
    yAxis: [
      {
        type: 'value',
        name: '销售额',
        position: 'left',
        axisLabel: {
          formatter: '{value} 元'
        }
      },
      {
        type: 'value',
        name: '订单量',
        position: 'right'
      }
    ],
    series: [
      {
        name: '销售额',
        type: 'line',
        data: data.map(item => item.sales),
        itemStyle: {
          color: CHART_COLORS.primary
        }
      },
      {
        name: '订单量',
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
 * 获取订单状态分布图配置
 */
export function getOrderStatusOption(data: OrderStatusDistributionDto[]): EChartsOption {
  return {
    ...CHART_THEME,
    tooltip: {
      ...CHART_THEME.tooltip,
      trigger: 'item',
      formatter: '{b}: {c}单 ({d}%)'
    },
    legend: {
      ...CHART_THEME.legend,
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '订单状态',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          name: item.status,
          value: item.count
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

/**
 * 获取支付方式分布图配置
 */
export function getPaymentMethodOption(data: PaymentMethodDistributionDto[]): EChartsOption {
  return {
    ...CHART_THEME,
    tooltip: {
      ...CHART_THEME.tooltip,
      trigger: 'item',
      formatter: '{b}: {c}单 ({d}%)'
    },
    legend: {
      ...CHART_THEME.legend,
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '支付方式',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          name: item.method,
          value: item.count
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

/**
 * 获取商品类别销售分布图配置
 */
export function getCategorySalesOption(data: CategorySalesDistributionDto[]): EChartsOption {
  return {
    ...CHART_THEME,
    tooltip: {
      ...CHART_THEME.tooltip,
      trigger: 'item',
      formatter: '{b}: {c}元 ({d}%)'
    },
    legend: {
      ...CHART_THEME.legend,
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: '商品类别',
        type: 'pie',
        radius: '50%',
        data: data.map(item => ({
          name: item.name,
          value: item.sales
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

/**
 * 获取地域销售分布图配置
 */
export function getRegionSalesOption(data: RegionSalesDistributionDto[]): EChartsOption {
  return {
    ...CHART_THEME,
    tooltip: {
      ...CHART_THEME.tooltip,
      trigger: 'item',
      formatter: (params: any) => {
        return `${params.name}: ${Number.isNaN(params.value) ? 0 : Number(params.value).toFixed(2)}元`
      }
    },
    visualMap: {
      min: 0,
      max: Math.max(...data.map(item => item.sales)),
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#e0f3f8', '#abd9e9', '#74add1', '#4575b4', '#313695']
      }
    },
    series: [
      {
        name: '地域销售',
        type: 'map',
        map: 'china',
        emphasis: {
          label: {
            show: true
          }
        },
        data: data.map(item => ({
          name: getEchartsMapName(item.provinceName),
          value: item.sales,
          percentage: item.percentage
        }))
      }
    ]
  }
}
