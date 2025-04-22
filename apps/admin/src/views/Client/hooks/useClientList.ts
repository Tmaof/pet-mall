import { getClientList } from '@/api/client'
import type { QueryClientListDto } from '@/api/client/req-dto'
import type { ClientListDto } from '@/api/client/res-dto'
import { ref, watch } from 'vue'

/**
 * 客户列表Hook
 */
export function useClientList() {
  /** 加载状态 */
  const loading = ref(false)

  /** 查询参数 */
  const queryParams = ref<QueryClientListDto>({})
  const page = ref(1)
  const pageSize = ref(10)
  watch([page, pageSize], () => {
    fetchData()
  })

  watch(queryParams, () => {
    console.log(queryParams.value)
  })

  /** 表格数据 */
  const tableData = ref<ClientListDto['list']>([])

  /** 总条数 */
  const total = ref(0)

  /** 获取列表数据 */
  const fetchData = async () => {
    loading.value = true
    try {
      const res = await getClientList({
        ...queryParams.value,
        page: page.value,
        pageSize: pageSize.value
      })
      tableData.value = res.list
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  /** 刷新列表 */
  const refresh = () => {
    fetchData()
  }

  return {
    loading,
    queryParams,
    tableData,
    total,
    fetchData,
    refresh,
    page,
    pageSize
  }
}
