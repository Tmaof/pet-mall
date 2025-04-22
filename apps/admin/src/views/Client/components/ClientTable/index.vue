<template>
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />

        <el-table-column prop="clientname" label="客户名" min-width="120" />

        <el-table-column prop="avatar" label="头像" width="80">
            <template #default="{ row }">
                <el-avatar :size="40" :src="row.avatar">
                    <el-icon>
                        <User />
                    </el-icon>
                </el-avatar>
            </template>
        </el-table-column>

        <el-table-column prop="gender" label="性别" width="80">
            <template #default="{ row }">
                <el-tag :type="row.gender === ClientGender.MALE ? 'primary' : 'danger'">
                    {{ GENDER_OPTIONS.find(item => item.value === row.gender)?.label }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" min-width="180" />

        <el-table-column prop="phone" label="电话" min-width="120" />

        <el-table-column prop="status" label="状态" width="80">
            <template #default="{ row }">
                <el-tag :type="STATUS_OPTIONS.find(item => item.value === row.status)?.type">
                    {{ STATUS_OPTIONS.find(item => item.value === row.status)?.label }}
                </el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="openTime" label="开通时间" width="180">
            <template #default="{ row }">
                {{ dayjs(row.openTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
        </el-table-column>

        <el-table-column label="操作" width="120" fixed="right">
            <template #default="{ row }">
                <div v-permission="'operate'">
                    <el-button v-if="row.status === ClientStatus.ENABLE" type="danger" link @click="handleDisable(row)">
                        禁用
                    </el-button>
                    <el-button v-if="row.status === ClientStatus.DISABLE" type="primary" link
                        @click="handleEnable(row)">
                        启用
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>

<script setup lang="ts">
import { disableClient, enableClient } from '@/api/client'
import type { Client } from '@/api/client/res-dto'
import { GENDER_OPTIONS, STATUS_OPTIONS } from '@/views/Client/client'
import { ClientGender, ClientStatus } from '@/api/client/enum'
import { User } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { ElMessage, ElMessageBox } from 'element-plus'
import { defineEmits, defineProps, ref, watch } from 'vue'

const props = defineProps<{
    /** 表格数据 */
    data: Client[];
    /** 加载状态 */
    loading: boolean;
}>()

const emit = defineEmits<{
    (e: 'refresh'): void;
}>()

/** 表格数据 */
const tableData = ref<Client[]>(props.data)

/** 监听数据变化 */
watch(() => props.data, (val) => {
  tableData.value = val
}, { deep: true })

/** 处理禁用客户 */
const handleDisable = async (row: Client) => {
  try {
    await ElMessageBox.confirm('确定要禁用该客户吗？', '提示', {
      type: 'warning'
    })

    await disableClient(row.id)
    ElMessage.success('禁用成功')
    emit('refresh')
  } catch (error) {
    // 用户取消或请求失败
  }
}

/** 处理启用客户 */
const handleEnable = async (row: Client) => {
  try {
    await ElMessageBox.confirm('确定要启用该客户吗？', '提示', {
      type: 'warning'
    })

    await enableClient(row.id)
    ElMessage.success('启用成功')
    emit('refresh')
  } catch (error) {
    // 用户取消或请求失败
  }
}
</script>

<style lang="scss" scoped>

</style>
