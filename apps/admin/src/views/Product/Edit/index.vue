<template>
  <el-card class="edit-product" shadow="never">
    <template #header>
      <div class="card-header">
        <span>编辑商品</span>
      </div>
    </template>

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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProductForm from '../components/ProductForm/index.vue'
import { updateProduct, getProduct } from '@/api/product/list/list'
import { getCategoryTree } from '@/api/product/category/category'
import type { GetCategoryTreeResDto } from '@/api/product/category/res-dto'
import type { ProductDto } from '@/api/product/list/res-dto'
import type { TagDto } from '@/api/product/tag/res-dto'
import { getAllTags } from '@/api/product/tag/tag'

const router = useRouter()
const route = useRoute()
const formRef = ref()
const categoryTree = ref<GetCategoryTreeResDto[]>([])
const tags = ref<TagDto[]>([])

/** 提交表单 */
const handleSubmit = async (formData: Partial<ProductDto>) => {
  const id = Number(route.params.id)
  await updateProduct(id, formData)
  ElMessage.success('更新商品成功')
  setTimeout(() => {
    router.push({
      name: 'product-list',
      query: { refresh: '1' }
    })
  }, 1000)
}

onMounted(async() => {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('商品ID不存在')
    return
  }
  // 获取分类树
  categoryTree.value = await getCategoryTree()
  // 获取商品数据
  const product = await getProduct(id)
  formRef.value?.setFormData(product)
  // 获取标签
  tags.value = await getAllTags()
})

</script>
<script lang="ts">
export default {
  name: 'EditProduct'
}
</script>

<style lang="scss" scoped>
.edit-product {

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
