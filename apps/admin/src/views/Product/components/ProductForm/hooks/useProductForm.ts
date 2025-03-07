import { reactive } from 'vue'
import type { FormRules } from 'element-plus'
import i18n from '@/i18n'
export function useProductForm() {
  /** 表单数据 */
  const form = reactive({
    title: '',
    categoryId: null as number | null,
    mainImage: '',
    description: '',
    price: 0,
    stock: 0,
    isOnSale: true,
    tagIds: []
  })

  /** 表单验证规则 */
  const rules: FormRules = {
    title: [
      { required: true, message: () => i18n.$t('hooks.useProductForm.142325-0').value, trigger: 'blur' },
      { min: 1, max: 100, message: () => i18n.$t('hooks.useProductForm.142325-1').value, trigger: 'blur' }
    ],
    categoryId: [
      { required: true, message: () => i18n.$t('hooks.useProductForm.142325-2').value, trigger: 'change' }
    ],
    mainImage: [
      { required: true, message: () => i18n.$t('hooks.useProductForm.142325-3').value, trigger: 'change' }
    ],
    price: [
      { required: true, message: () => i18n.$t('hooks.useProductForm.142325-4').value, trigger: 'blur' },
      { type: 'number', min: 0, message: () => i18n.$t('hooks.useProductForm.142325-5').value, trigger: 'blur' }
    ],
    stock: [
      { required: true, message: () => i18n.$t('hooks.useProductForm.142325-6').value, trigger: 'blur' },
      { type: 'number', min: 0, message: () => i18n.$t('hooks.useProductForm.142325-7').value, trigger: 'blur' }
    ]
  }

  return {
    form,
    rules
  }
}
