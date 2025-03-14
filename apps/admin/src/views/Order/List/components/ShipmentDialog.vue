<template>
  <el-dialog
    :title="$t('components.ShipmentDialog.383716-0')"
    v-model="dialogVisible"
    width="500px"
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item :label="$t('components.ShipmentDialog.383716-1')" prop="shippingCompany">
        <el-input v-model="form.shippingCompany" :placeholder="$t('components.ShipmentDialog.383716-2')" />
      </el-form-item>
      <el-form-item :label="$t('components.ShipmentDialog.383716-3')" prop="trackingNumber">
        <el-input v-model="form.trackingNumber" :placeholder="$t('components.ShipmentDialog.383716-4')" />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">{{ $t('components.ShipmentDialog.383716-5') }}</el-button>
      <el-button type="primary" :loading="loading" @click="handleSubmit">
        {{ $t('components.ShipmentDialog.383716-6') }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { updateOrderStatus } from '@/api/order/list'
import { OrderStatus } from '@/api/order/list/enum'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import { computed, defineEmits, defineProps, ref } from 'vue'
import i18n from '@/i18n'

const props = defineProps<{
  visible: boolean
  orderId?: number
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'success'): void
}>()

/** 弹窗显示状态 */
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

/** 表单ref */
const formRef = ref<FormInstance>()

/** 加载状态 */
const loading = ref(false)

/** 表单数据 */
const form = ref({
  shippingCompany: '',
  trackingNumber: ''
})

/** 表单校验规则 */
const rules = {
  shippingCompany: [
    { required: true, message: i18n.$t('components.ShipmentDialog.383716-2'), trigger: 'blur' }
  ],
  trackingNumber: [
    { required: true, message: i18n.$t('components.ShipmentDialog.383716-4'), trigger: 'blur' }
  ]
}

/** 提交表单 */
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate()

  loading.value = true
  try {
    await updateOrderStatus(props.orderId!, {
      status: OrderStatus.SHIPPED,
      ...form.value
    })

    ElMessage.success(i18n.$t('components.ShipmentDialog.383716-7').value)
    dialogVisible.value = false
    emit('success')
  } finally {
    loading.value = false
  }
}
</script>
