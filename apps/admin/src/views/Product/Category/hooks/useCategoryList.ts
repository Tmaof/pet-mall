import { ref } from 'vue'
import { getCategoryTree, deleteCategoryById } from '@/api/product/category'

export function useCategoryList() {
  const categoryTree = ref([])
  const loading = ref(false)

  // 获取分类树
  const fetchCategoryList = async () => {
    try {
      loading.value = true
      const data = await getCategoryTree()
      categoryTree.value = data
    } finally {
      loading.value = false
    }
  }

  // 删除分类
  const deleteCategory = async (id: number) => {
    const res = await deleteCategoryById(id)
    return res
  }

  return {
    categoryTree,
    loading,
    fetchCategoryList,
    deleteCategory
  }
}
