import { reactive } from 'vue'
import { createCategory as apiCreateCategory, updateCategory as apiUpdateCategory } from '@/api/product/category/category'
import i18n from '@/i18n'

export function useCategoryForm() {
  // 表单数据
  const form = reactive({
    name: '',
    sortOrder: 0,
    isVisible: true
  })

  // 表单验证规则
  const rules = {
    name: [
      { required: true, message: i18n.$t('hooks.useCategoryForm.360371-0'), trigger: 'blur' },
      { min: 1, max: 50, message: i18n.$t('hooks.useCategoryForm.360371-1'), trigger: 'blur' }
    ],
    sortOrder: [
      { required: true, message: i18n.$t('hooks.useCategoryForm.360371-2'), trigger: 'blur' },
      { type: 'number', message: i18n.$t('hooks.useCategoryForm.360371-3'), trigger: 'blur' }
    ]
  }

  // 重置表单
  const resetForm = () => {
    form.name = ''
    form.sortOrder = 0
    form.isVisible = true
  }

  // 创建分类
  const createCategory = async (params: any) => {
    const res = await apiCreateCategory(params)
    return res
  }

  // 更新分类
  const updateCategory = async (params: any) => {
    const res = await apiUpdateCategory(params.id, params)
    return res
  }

  return {
    form,
    rules,
    resetForm,
    createCategory,
    updateCategory
  }
}
