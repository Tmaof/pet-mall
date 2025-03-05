import { ref } from 'vue'
import { getTagList, deleteTag } from '@/api/product/tag/tag'
import type { TagDto } from '@/api/product/tag/res-dto'

export function useTagList() {
  const loading = ref(false)
  const total = ref(0)
  const tagList = ref<TagDto[]>([])

  // 分页参数
  const page = ref(1)
  const pageSize = ref(10)

  /** 获取标签列表 */
  const fetchTagList = async () => {
    try {
      loading.value = true
      const data = await getTagList({
        page: page.value,
        pageSize: pageSize.value
      })
      tagList.value = data.list
      total.value = data.total
    } finally {
      loading.value = false
    }
  }

  /** 删除标签 */
  const handleDelete = async (id: number) => {
    await deleteTag(id)
    // 如果当前页只有一条数据，且不是第一页，则跳转到上一页
    if (tagList.value.length === 1 && page.value > 1) {
      page.value--
    }
    await fetchTagList()
  }

  /** 处理页码变化 */
  const handlePageChange = (newPage: number) => {
    page.value = newPage
    fetchTagList()
  }

  /** 处理每页条数变化 */
  const handleSizeChange = (newSize: number) => {
    pageSize.value = newSize
    page.value = 1
    fetchTagList()
  }

  return {
    loading,
    total,
    tagList,
    page,
    pageSize,
    fetchTagList,
    handleDelete,
    handlePageChange,
    handleSizeChange
  }
}
