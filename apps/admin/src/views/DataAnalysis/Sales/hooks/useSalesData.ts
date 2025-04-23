import { getSalesAnalysis } from '@/api/data-analysis/sales'
import type { SalesAnalysisReqDto } from '@/api/data-analysis/sales/req-dto'
import type { SalesAnalysisResDto } from '@/api/data-analysis/sales/res-dto'
import { onMounted, ref } from 'vue'

export function useSalesData() {
  const loading = ref(false)
  const salesData = ref<SalesAnalysisResDto>()

  const fetchSalesData = async (params: SalesAnalysisReqDto = {}) => {
    loading.value = true
    try {
      const data = await getSalesAnalysis(params)
      salesData.value = data
    } finally {
      loading.value = false
    }
  }

  // 初始化加载数据
  onMounted(() => {
    fetchSalesData()
  })

  return {
    loading,
    salesData,
    fetchSalesData
  }
}
