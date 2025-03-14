<template>
  <el-dialog
    :title="$t('components.OrderDetail.923604-0')"
    v-model="dialogVisible"
    width="800px"
    destroy-on-close
  >
    <el-descriptions :column="2" border>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-1')">{{ orderData?.id }}</el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-2')">
        <el-tag :type="getOrderStatusType(orderData!.status)">
          {{ getOrderStatusLabel(orderData!.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-3')">¥{{ orderData?.totalAmount }}</el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-4')">{{ dateFilter(orderData?.createdAt) }}</el-descriptions-item>

      <!-- 支付信息 -->
      <el-descriptions-item :label="$t('components.OrderDetail.923604-5')" :span="2">
        {{
            // @ts-expect-error
            paymentMethodMap[orderData!.paymentMethod] || '-'
        }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-6')" :span="2">
        {{ orderData?.paymentTime ? dateFilter(orderData.paymentTime) : '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-7')" :span="2">
        {{ orderData?.paymentNo || '-' }}
      </el-descriptions-item>

      <!-- 收货地址 -->
      <el-descriptions-item :label="$t('components.OrderDetail.923604-8')" :span="2">
        <template v-if="orderData?.addressSnapshot">
          {{ orderData.addressSnapshot.consignee }} {{ orderData.addressSnapshot.phone }}<br>
          {{ orderData.addressSnapshot.province }}
          {{ orderData.addressSnapshot.city }}
          {{ orderData.addressSnapshot.district }}
          {{ orderData.addressSnapshot.detail }}
        </template>
      </el-descriptions-item>

      <!-- 物流信息 -->
      <el-descriptions-item :label="$t('components.OrderDetail.923604-9')" :span="2">
        {{ shippingMethodMap[orderData!.shippingMethod] || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-10')" :span="2">
        {{ orderData?.shippingCompany || '-' }}
      </el-descriptions-item>
      <el-descriptions-item :label="$t('components.OrderDetail.923604-11')" :span="2">
        {{ orderData?.trackingNumber || '-' }}
      </el-descriptions-item>

      <!-- 备注 -->
      <el-descriptions-item :label="$t('components.OrderDetail.923604-12')" :span="2">
        {{ orderData?.remark || '-' }}
      </el-descriptions-item>
    </el-descriptions>
    <!-- {{ $t('components.OrderDetail.923604-13') }} -->
    <div class="goods-list">
      <div class="title">{{ $t('components.OrderDetail.923604-13') }}</div>
      <el-table :data="[orderData?.client]" border>
        <el-table-column :label="$t('components.OrderDetail.923604-14')" width="100">
          <template #default="{ row }">
            <el-image
              preview-teleported
              :src="row.avatar"
              :preview-src-list="[row.avatar]"
              class="goods-image"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-15')">
          <template #default="{ row }">
            {{ row.clientname }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-16')" width="100">
          <template #default="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-17')" width="100">
          <template #default="{ row }">
            {{ row.phone }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-18')" width="100">
          <template #default="{ row }">
            {{
              // @ts-expect-error
              clientGenderMap[row.gender]
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-19')" width="100">
          <template #default="{ row }">
            {{
              // @ts-expect-error
              clientStatusMap[row.status]
            }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('components.OrderDetail.923604-20')" >
          <template #default="{ row }">
            {{ dateFilter(row.createdAt) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 商品列表 -->
    <div class="goods-list">
      <div class="title">{{ $t('components.OrderDetail.923604-21') }}</div>
      <el-table :data="orderData?.orderItems" border>
        <el-table-column :label="$t('components.OrderDetail.923604-22')" width="100">
          <template #default="{ row }">
            <el-image
              preview-teleported
              :src="row.mainImageSnapshot"
              :preview-src-list="[row.mainImageSnapshot]"
              class="goods-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="titleSnapshot" :label="$t('components.OrderDetail.923604-23')" />
        <el-table-column prop="unitPriceSnapshot" :label="$t('components.OrderDetail.923604-24')" width="100">
          <template #default="{ row }">
            ¥{{ row.unitPriceSnapshot }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" :label="$t('components.OrderDetail.923604-25')" width="100" />
        <el-table-column :label="$t('components.OrderDetail.923604-26')" width="120">
          <template #default="{ row }">
            ¥{{ (row.unitPriceSnapshot * row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { clientGenderMap, clientStatusMap } from '@/api/client/enum'
import { paymentMethodMap, shippingMethodMap } from '@/api/order/list/enum'
import type { OrderDto } from '@/api/order/list/res.dto'
import { dateFilter } from '@/filter/index'
import { computed, defineEmits, defineProps } from 'vue'
import { useOrderStatus } from '../hooks/useOrderStatus'

const props = defineProps<{
  visible: boolean
  orderData?: OrderDto
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

/** 弹窗显示状态 */
const dialogVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

/** 订单状态相关 */
const { getOrderStatusLabel, getOrderStatusType } = useOrderStatus()

</script>

<style lang="scss" scoped>
.goods-list {
  margin-top: 20px;

  .title {
    margin-bottom: 10px;
    font-weight: bold;
    color: var(--el-text-color-primary);
  }

  .goods-image {
    width: 60px;
    height: 60px;
    border-radius: var(--el-border-radius-small);
  }
}
</style>
