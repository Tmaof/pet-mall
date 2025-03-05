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
      label-width="80px"
    >
      <el-form-item :label="$t('components.TagDialog.233911-0')" prop="name">
        <el-input v-model="form.name" :placeholder="$t('components.TagDialog.233911-1')" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="handleCancel">{{ $t('components.TagDialog.233911-2') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ $t('components.TagDialog.233911-3') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, withDefaults, defineProps, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'
import { useTagForm } from '../hooks/useTagForm'
import type { TagDto } from '@/api/product/tag/res-dto'
import i18n from '@/i18n'
interface Props {
  modelValue: boolean
  mode: 'create' | 'edit'
  tag?: TagDto
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create',
  tag: undefined
})

const emit = defineEmits(['update:modelValue', 'success'])

/** 表单相关 */
const formRef = ref<FormInstance>()
const loading = ref(false)

/** 使用表单处理 hook */
const { form, rules, resetForm, createTag, updateTag } = useTagForm()

/** 计算对话框标题 */
const dialogTitle = computed(() => props.mode === 'create' ? i18n.$t('components.TagDialog.233911-4').value : i18n.$t('components.TagDialog.233911-5').value)

// 监听 tag 变化，更新表单数据
watch(
  () => props.tag,
  (newVal) => {
    if (newVal) {
      Object.assign(form, newVal)
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const action = props.mode === 'create' ? createTag : updateTag
    await action(form as any)
    const status = props.mode === 'create' ? i18n.$t('components.TagDialog.233911-6') : i18n.$t('components.TagDialog.233911-7')
    ElMessage.success(i18n.$t('components.TagDialog.233911-8', [status.value]).value)
    emit('success')
    handleCancel()
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/** 取消操作 */
const handleCancel = () => {
  resetForm()
  emit('update:modelValue', false)
}
</script>
<script lang="ts">
export default {
  name: 'TagDialog'
}
</script>
