import { ref, reactive } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { getProductList, deleteProduct } from '@/api/product/list/list'
import type { ProductDto } from '@/api/product/list/res-dto'
import type { QueryProductDto } from '@/api/product/list/req-dto'
import { SALE_STATUS } from '@/enums'
import i18n from '@/i18n'

/** 获取空搜索表单 */
function getEmptySearchForm() {
  return {
    id: undefined,
    title: undefined,
    categoryId: [],
    minPrice: undefined,
    maxPrice: undefined,
    minStock: undefined,
    maxStock: undefined,
    isOnSale: true,
    /** 创建时间范围 */
    createdRange: ['', ''],
    page: 1,
    pageSize: 10
  }
}

/** 搜索表单类型 */
type SearchForm = ReturnType<typeof getEmptySearchForm>

/** 格式化搜索表单 */
function formatSearchForm(searchForm: SearchForm) {
  const form: QueryProductDto = {}
  // 格式化分类ID
  if (Array.isArray(searchForm.categoryId)) {
    form.categoryId = searchForm.categoryId[searchForm.categoryId.length - 1]
  }
  // 格式化创建时间范围
  if (searchForm.createdRange[0]) {
    form.createdAtStart = searchForm.createdRange[0]
  }
  if (searchForm.createdRange[1]) {
    form.createdAtEnd = searchForm.createdRange[1]
  }
  // 格式化售卖状态
  form.isOnSale = searchForm.isOnSale ? SALE_STATUS.sale : SALE_STATUS.stop
  const data = Object.assign({}, searchForm, form) as any
  data.createdRange = undefined
  return data
}

export function useProductList() {
  const loading = ref(false)
  const productList = ref<ProductDto[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  /** 搜索表单 */
  const searchForm = reactive(getEmptySearchForm())

  /** 获取商品列表 */
  const fetchProductList = async () => {
    try {
      loading.value = true
      const formData = formatSearchForm(searchForm)
      const { list, total: totalCount } = await getProductList(formData)
      productList.value = list
      total.value = totalCount
    } finally {
      loading.value = false
    }
  }

  /** 搜索 */
  const handleSearch = () => {
    page.value = 1
    fetchProductList()
  }

  /** 重置搜索 */
  const handleReset = () => {
    searchForm.page = 1
    Object.assign(searchForm, getEmptySearchForm())
    fetchProductList()
  }

  /** 处理每页条数变化 */
  const handleSizeChange = (newSize: number) => {
    searchForm.pageSize = newSize
    fetchProductList()
  }

  /** 处理页码变化 */
  const handlePageChange = (newPage: number) => {
    searchForm.page = newPage
    fetchProductList()
  }

  /** 删除商品 */
  const handleDelete = async (row: ProductDto) => {
    try {
      await ElMessageBox.confirm(i18n.$t('hooks.useProductList.830944-0').value, i18n.$t('hooks.useProductList.830944-1').value, {
        type: 'warning'
      })
      await deleteProduct(row.id)
      ElMessage.success(i18n.$t('hooks.useProductList.830944-2').value)
      fetchProductList()
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  return {
    loading,
    productList,
    total,
    page,
    pageSize,
    searchForm,
    fetchProductList,
    handleSearch,
    handleReset,
    handleSizeChange,
    handlePageChange,
    handleDelete
  }
}
