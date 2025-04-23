import { getDashboardData } from '@/api/data-analysis/dashboard'
import type { DashboardDataDto } from '@/api/data-analysis/dashboard/res-dto'
import { onMounted, onUnmounted, ref } from 'vue'
import { REFRESH_INTERVAL } from '../constants'

/**
 * 获取仪表盘数据的hook
 */
export function useDashboardData() {
  /** 仪表盘数据 */
  const dashboardData = ref<DashboardDataDto>()
  /** 加载状态 */
  const loading = ref(false)
  /** 定时器ID */
  let timer: number | null = null

  /**
     * 获取数据
     */
  const fetchData = async () => {
    try {
      loading.value = true
      dashboardData.value = await getDashboardData()
    } finally {
      loading.value = false
    }
  }

  /**
     * 启动定时刷新
     */
  const startAutoRefresh = () => {
    timer = window.setInterval(fetchData, REFRESH_INTERVAL)
  }

  /**
     * 停止定时刷新
     */
  const stopAutoRefresh = () => {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  onMounted(() => {
    fetchData()
    startAutoRefresh()
  })

  onUnmounted(() => {
    stopAutoRefresh()
  })

  return {
    dashboardData,
    loading,
    fetchData
  }
}
