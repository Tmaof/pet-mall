<template>
  <el-dialog
    :title="dialogTitle"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    width="500px"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item :label="$t('components.CategoryDialog.044870-0')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('components.CategoryDialog.044870-1')" />
      </el-form-item>

      <el-form-item :label="$t('components.CategoryDialog.044870-2')">
        <el-input
          :model-value="parentCategory?.name || $t('components.CategoryDialog.044870-3')"
          disabled
          :placeholder="$t('components.CategoryDialog.044870-3')"
        />
      </el-form-item>

      <el-form-item :label="$t('components.CategoryDialog.044870-4')" prop="sortOrder">
        <el-input-number
          v-model="form.sortOrder"
          :min="0"
          :max="999"
          :placeholder="$t('components.CategoryDialog.044870-5')"
        />
      </el-form-item>

      <el-form-item :label="$t('components.CategoryDialog.044870-6')" prop="isVisible">
        <el-switch v-model="form.isVisible" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">{{ $t('components.CategoryDialog.044870-7') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ $t('components.CategoryDialog.044870-8') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import { useCategoryForm } from '../hooks/useCategoryForm'
import i18n from '@/i18n'

const props = defineProps({
  modelValue: Boolean,
  mode: {
    type: String,
    default: 'create'
  },
  category: {
    type: Object,
    default: () => null
  },
  parentCategory: {
    type: Object,
    default: () => null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

// 表单相关
const formRef = ref(null)
const loading = ref(false)

// 使用表单处理 hook
const { form, rules, resetForm, createCategory, updateCategory } = useCategoryForm()

/** 计算对话框标题 */
const dialogTitle = computed(() => {
  if (props.mode === 'create') {
    return props.parentCategory ? i18n.$t('components.CategoryDialog.044870-9').value : i18n.$t('components.CategoryDialog.044870-10').value
  }
  return i18n.$t('components.CategoryDialog.044870-11').value
})

// 监听 category 变化，更新表单数据
watch(
  () => props.category,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const params = {
      ...form,
      parentId: props.parentCategory?.id
    }

    const action = props.mode === 'create' ? createCategory : updateCategory
    await action(params)
    const successMessage = props.mode === 'create' ? i18n.$t('components.CategoryDialog.044870-12').value : i18n.$t('components.CategoryDialog.044870-13').value
    ElMessage.success(`${successMessage} ${i18n.$t('components.CategoryDialog.044870-14').value}`)
    emit('success')
    handleCancel()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 取消操作
const handleCancel = () => {
  resetForm()
  emit('update:modelValue', false)
}
</script>
