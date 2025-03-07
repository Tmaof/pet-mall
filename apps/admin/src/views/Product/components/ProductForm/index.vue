<template>
  <el-form
    ref="formRef"
    :model="form"
    v-model="form"
    :rules="rules"
    label-width="120px"
    class="product-form"
    label-position="top"
  >
    <el-form-item :label="$t('ProductForm.index.622829-0')" prop="title">
      <el-input v-model="form.title" :placeholder="$t('ProductForm.index.622829-1')" />
    </el-form-item>

    <el-form-item :label="$t('ProductForm.index.622829-2')" prop="categoryId">
      <el-cascader
        v-model="form.categoryId"
        :options="categoryTree"
        :props="{ value: 'id', label: 'name' }"
        :placeholder="$t('ProductForm.index.622829-3')"
      />
    </el-form-item>

    <el-form-item :label="$t('ProductForm.index.622829-4')" prop="mainImage">
      <el-upload
        class="product-image-uploader"
        :http-request="uploadImage"
        :show-file-list="false"
        accept="image/*"
      >
        <img v-if="form.mainImage" :src="form.mainImage" class="product-image" />
        <el-icon v-else class="product-image-uploader-icon"><Plus /></el-icon>
      </el-upload>
    </el-form-item>

    <el-form-item :label="$t('hooks.useProductForm.142325-8')" prop="price">
      <el-input-number
        v-model="form.price"
        :min="0"
        :max="9999999.99"
        :precision="2"
        :step="0.01"
      />
    </el-form-item>

    <el-form-item :label="$t('hooks.useProductForm.142325-9')" prop="stock">
      <el-input-number
        v-model="form.stock"
        :min="0"
        :max="999999"
        :precision="0"
        :step="1"
      />
    </el-form-item>

    <el-form-item :label="$t('hooks.useProductForm.142325-10')" prop="isOnSale">
      <el-switch v-model="form.isOnSale" />
    </el-form-item>

    <el-form-item :label="$t('hooks.useProductForm.142325-14')" prop="tagIds">
      <el-select tag-type="success" filterable :multiple-limit="5" v-model="form.tagIds" multiple :placeholder="$t('hooks.useProductForm.142325-15')">
        <el-option v-for="tag in tags" :key="tag.id" :label="tag.name" :value="tag.id" />
      </el-select>
    </el-form-item>

    <el-form-item :label="$t('hooks.useProductForm.142325-11')" prop="description">
      <md-editor v-model="form.description" :height="400" />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="handleSubmit">
        {{ $t('hooks.useProductForm.142325-12') }}
      </el-button>
      <el-button @click="handleReset">
        {{ $t('hooks.useProductForm.142325-13') }}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, defineExpose } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import MdEditor from '../MdEditor/index.vue'
import { useProductForm } from './hooks/useProductForm'
import { uploadFile } from '@/api/upload/upload'
import type { GetCategoryTreeResDto } from '@/api/product/category/res-dto'
import { CreateProductDto } from '@/api/product/add/req.dto'
import i18n from '@/i18n'
import { SALE_STATUS } from '@/enums'
import type { TagDto } from '@/api/product/tag/res-dto'

interface Props {
  categoryTree: GetCategoryTreeResDto[]
  tags: TagDto[]
}

defineProps<Props>()

const emit = defineEmits(['submit'])

const formRef = ref<FormInstance>()
const { form, rules } = useProductForm()

/** 上传图片 */
const uploadImage = async ({ file }: { file: File }) => {
  try {
    const { succMap, errFiles } = await uploadFile(file)
    if (errFiles.length > 0) {
      ElMessage.error(i18n.$t('ProductForm.index.622829-5').value + errFiles.join(', '))
    }
    form.mainImage = succMap[file.name]
  } catch (error) {
    console.error('Upload failed:', error)
  }
}

/** 格式化表单数据 */
function formatFormData(form:any):CreateProductDto {
  return {
    ...form,
    categoryId: form.categoryId[form.categoryId.length - 1],
    isOnSale: form.isOnSale ? SALE_STATUS.sale : SALE_STATUS.stop,
    categoryName: undefined
  }
}

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    const formData = formatFormData(form)
    emit('submit', formData)
  } catch (error) {
    console.error('Validation failed:', error)
  }
}

/** 重置表单 */
const handleReset = () => {
  formRef.value?.resetFields()
}

/** 设置表单数据 */
const handleSetFormData = (data: any) => {
  handleReset()
  // 格式化售卖状态
  data.isOnSale = data.isOnSale === SALE_STATUS.sale
  // 格式化标签
  data.tagIds = data.tags.map((tag: TagDto) => tag.id)
  Object.assign(form, data)
}

// 暴露重置表单的函数
defineExpose({
  resetForm: handleReset,
  setFormData: handleSetFormData
})
</script>
<script lang="ts">
export default {
  name: 'ProductForm'
}
</script>

<style lang="scss" scoped>
.product-form {

  .product-image-uploader {
    :deep(.el-upload) {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration);

      &:hover {
        border-color: var(--el-color-primary);
      }
    }
  }

  .product-image-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
    line-height: 178px;
  }

  .product-image {
    width: 178px;
    height: 178px;
    display: block;
    object-fit: cover;
  }
}
</style>
