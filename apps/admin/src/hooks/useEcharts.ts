import * as echarts from 'echarts'
import { SVGRenderer, CanvasRenderer } from 'echarts/renderers'
import { onMounted, onUnmounted, ref } from 'vue'

type Options = {
  renderer?: 'svg' | 'canvas';
};

/**
 * 使用图表的hook
 */
export function useECharts(options: Options = {}) {
  const { renderer = 'svg' } = options
  /** 图表实例 */
  const chartInstance = ref<echarts.ECharts>()
  /** 图表容器 */
  const chartContainer = ref<HTMLElement>()

  /**
   * 初始化图表
   */
  const initChart = () => {
    if (chartContainer.value) {
      if (renderer === 'svg') {
        // @ts-expect-error
        echarts.use([SVGRenderer])
      } else {
        // @ts-expect-error
        echarts.use([CanvasRenderer])
      }
      chartInstance.value = echarts.init(chartContainer.value, null, {
        renderer: renderer || 'svg'
      })
    }
  }

  /**
   * 设置图表配置
   */
  const setOption = (option: echarts.EChartsOption) => {
    if (chartInstance.value) {
      chartInstance.value.setOption(option)
    }
  }

  /**
   * 监听窗口大小变化
   */
  const handleResize = () => {
    if (chartInstance.value) {
      chartInstance.value.resize()
    }
  }

  onMounted(() => {
    initChart()
    window.addEventListener('resize', handleResize)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }
  })

  return {
    /** 图表容器 */
    conRef: chartContainer,
    /** 图表实例 */
    chartRef: chartInstance,
    /** 设置图表配置 */
    setOpt: setOption
  }
}
