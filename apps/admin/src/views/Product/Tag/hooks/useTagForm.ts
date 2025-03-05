import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import { createTag as apiCreateTag, updateTag as apiUpdateTag } from '@/api/product/tag/tag'
import type { CreateTagDto, UpdateTagDto } from '@/api/product/tag/req-dto'
import i18n from '@/i18n'

export function useTagForm() {
  // 表单数据
  const form = reactive<CreateTagDto & { id?: number }>({
    name: ''
  })

  // 表单验证规则
  const rules: FormRules = {
    name: [
      { required: true, message: i18n.$t('hooks.useTagForm.383019-0').value, trigger: 'blur' },
      { min: 1, max: 50, message: i18n.$t('hooks.useTagForm.383019-1').value, trigger: 'blur' }
    ]
  }

  // 重置表单
  const resetForm = () => {
    form.id = undefined
    form.name = ''
  }

  // 创建标签
  const createTag = async (params: CreateTagDto) => {
    return await apiCreateTag(params)
  }

  // 更新标签
  const updateTag = async (params: UpdateTagDto & { id: number }) => {
    const { id, ...updateData } = params
    return await apiUpdateTag(id, updateData)
  }

  return {
    form,
    rules,
    resetForm,
    createTag,
    updateTag
  }
}
