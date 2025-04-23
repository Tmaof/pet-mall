import * as echarts from 'echarts'
import { CanvasRenderer, SVGRenderer } from 'echarts/renderers'
import { markRaw, onMounted, onUnmounted, ref } from 'vue'
import { registerChinaMap } from '@/assets/js/china'
// 注册中国地图
registerChinaMap(echarts)

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
      const chart = echarts.init(chartContainer.value, null, {
        renderer: renderer || 'svg'
      })
      //   https://blog.csdn.net/youyudehan/article/details/135222342
      // 标记这个DOM对象， Vue 不要将其转换为响应式数据。
      chartInstance.value = markRaw(chart)
    }
  }

  /**
   * 设置图表配置
   */
  const setOption = (option: echarts.EChartsOption) => {
    if (chartInstance.value) {
      // 在 VUE 中如果想实时绘制Echarts的话，需要手动的调用 setOption(option, true)
      chartInstance.value.setOption(option, true)
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
