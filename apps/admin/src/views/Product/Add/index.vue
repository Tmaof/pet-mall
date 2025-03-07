<template>
  <el-card class="add-product" shadow="never">
    <product-form
      ref="formRef"
      :category-tree="categoryTree"
      :tags="tags"
      @submit="handleSubmit"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ProductForm from '../components/ProductForm/index.vue'
import { createProduct } from '@/api/product/add/add'
import { getCategoryTree } from '@/api/product/category/category'
import type { GetCategoryTreeResDto } from '@/api/product/category/res-dto'
import type { CreateProductDto } from '@/api/product/add/req.dto'
import i18n from '@/i18n'
import type { TagDto } from '@/api/product/tag/res-dto'
import { getAllTags } from '@/api/product/tag/tag'

const formRef = ref()
const categoryTree = ref<GetCategoryTreeResDto[]>([])
const tags = ref<TagDto[]>([])
/** 获取分类树 */
const fetchCategoryTree = async () => {
  categoryTree.value = await getCategoryTree()
}

/** 获取标签 */
const fetchTags = async () => {
  tags.value = await getAllTags()
}

/** 提交表单 */
const handleSubmit = async (formData: CreateProductDto) => {
  await createProduct(formData)
  ElMessage.success(i18n.$t('Add.index.799084-0').value)
  // 重置表单
  formRef.value?.resetForm()
}

onMounted(() => {
  fetchCategoryTree()
  fetchTags()
})
</script>

<style lang="scss" scoped>
.add-product {

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
