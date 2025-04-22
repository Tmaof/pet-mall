<template>
    <el-form class="search-form" :model="formData" ref="formRef" inline>
        <el-form-item label="客户ID" prop="id">
            <el-input v-model="formData.id" placeholder="请输入客户ID" />
        </el-form-item>

        <el-form-item label="客户名" prop="clientname">
            <el-input v-model="formData.clientname" placeholder="请输入客户名" clearable />
        </el-form-item>

        <el-form-item label="性别" prop="gender">
            <el-select fit-input-width v-model="formData.gender" placeholder="请选择性别" clearable>
                <el-option v-for="item in GENDER_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
            <el-select fit-input-width v-model="formData.status" placeholder="请选择状态" clearable>
                <el-option v-for="item in STATUS_OPTIONS" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>

        <el-form-item label="开通时间" prop="timeRange">
            <el-date-picker v-model="timeRange" @change="handleTimeRangeChange" type="daterange" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" value-format="YYYY-MM-DD" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import type { QueryClientListDto } from '@/api/client/req-dto'
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/views/Client/client'
import type { FormInstance } from 'element-plus'
import { defineEmits, defineProps, ref, watch } from 'vue'
const props = defineProps<{
    /** 表单数据 */
    modelValue: QueryClientListDto;
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: QueryClientListDto): void;
    (e: 'search'): void;
}>()

/** 表单实例 */
const formRef = ref<FormInstance>()

/** 表单数据 */
const formData = ref<QueryClientListDto>({ ...props.modelValue })

/** 时间范围 */
const timeRange = ref<[string, string]>(['', ''])

/** 处理时间范围变化 */
const handleTimeRangeChange = (val: [string, string] | null) => {
  if (val) {
    formData.value.startTime = val[0]
    formData.value.endTime = val[1]
  }
}

/** 监听外界传入表单的变化 */
watch(() => props.modelValue, (val) => {
  formData.value = { ...val }
  if (val.startTime && val.endTime) {
    timeRange.value = [val.startTime, val.endTime]
  } else {
    timeRange.value = ['', '']
  }
})

/** 搜索 */
const handleSearch = () => {
  emit('update:modelValue', formData.value)
  emit('search')
}

/** 重置 */
const handleReset = () => {
  formRef.value?.resetFields()
  timeRange.value = ['', '']
  emit('update:modelValue', {})
  emit('search')
}
</script>

<style lang="scss" scoped>
.search-form {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
}
</style>
