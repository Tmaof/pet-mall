<template>
  <div class="order-list">
    <!-- 搜索表单 -->
    <el-form :model="searchForm" inline class="search-form">
      <el-form-item :label="$t('List.index.963864-0')">
        <el-input v-model="searchForm.id" :placeholder="$t('List.index.963864-1')" />
      </el-form-item>
      <el-form-item :label="$t('List.index.963864-2')">
        <el-select v-model="searchForm.status" style="min-width: 200px" :placeholder="$t('List.index.963864-3')" clearable>
          <el-option
            v-for="item in orderStatusOptions"
            :key="item.label.value"
            :label="item.label.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('List.index.963864-4')">
        <el-date-picker
          v-model="dateRange"
          type="daterange"
          :range-separator="$t('List.index.963864-5')"
          :start-placeholder="$t('List.index.963864-6')"
          :end-placeholder="$t('List.index.963864-7')"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ $t('List.index.963864-8') }}</el-button>
        <el-button @click="handleReset">{{ $t('List.index.963864-9') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 订单列表 -->
    <el-table :data="orderList" border style="width: 100%" v-loading="loading">
      <el-table-column prop="id" :label="$t('List.index.963864-0')" width="80" />
      <el-table-column :label="$t('List.index.963864-10')" min-width="300">
        <template #default="{ row }">
          <!-- {{ $t('List.index.963864-10') }} -->
          <div v-for="item in row.orderItems" :key="item.id" class="order-item">
            <el-image preview-teleported :src="item.mainImageSnapshot" :preview-src-list="[item.mainImageSnapshot]" class="product-image" />
            <div class="product-info">
              <div class="product-title">{{ item.titleSnapshot }}</div>
              <div class="product-price">
                ¥{{ item.unitPriceSnapshot }} × {{ item.quantity }}
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" :label="$t('List.index.963864-11')" width="100">
        <template #default="{ row }">
          ¥{{ row.totalAmount }}
        </template>
      </el-table-column>
      <el-table-column prop="status" :label="$t('List.index.963864-2')" width="120">
        <template #default="{ row }">
          <el-tag :type="getOrderStatusType(row.status)">
            {{ getOrderStatusLabel(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" :label="$t('List.index.963864-4')" width="180">
        <template #default="{ row }">
          {{ dateFilter(row.createdAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="$t('List.index.963864-12')" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="handleViewDetail(row)">
            {{ $t('List.index.963864-13') }}
          </el-button>
          <!-- 待支付 -->
          <template v-if="row.status === OrderStatus.PENDING_PAYMENT">
            <el-button link type="danger" @click="handleCancelOrder(row)">
              {{ $t('List.index.963864-14') }}
            </el-button>
          </template>
          <!-- 待发货 -->
          <template v-if="row.status === OrderStatus.PENDING_SHIPMENT">
            <el-button link type="primary" @click="handleShip(row)">
              {{ $t('List.index.963864-15') }}
            </el-button>
            <el-button link type="danger" @click="handleCancelOrder(row)">
              {{ $t('List.index.963864-14') }}
            </el-button>
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 详情弹窗 -->
    <OrderDetail
      v-model:visible="detailVisible"
      :order-data="currentOrder"
    />

    <!-- 发货弹窗 -->
    <ShipmentDialog
      v-model:visible="shipmentVisible"
      :order-id="currentOrder?.id"
      @success="handleShipSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { getOrderList, updateOrderStatus } from '@/api/order/list'
import { OrderStatus } from '@/api/order/list/enum'
import type { OrderDto } from '@/api/order/list/res.dto'
import { dateFilter } from '@/filter/index'
import { ElMessage, ElMessageBox } from 'element-plus'
import { computed, ref } from 'vue'
import OrderDetail from './components/OrderDetail.vue'
import ShipmentDialog from './components/ShipmentDialog.vue'
import { useOrderStatus } from './hooks/useOrderStatus'
import i18n from '@/i18n'

/** 搜索表单 */
const searchForm = ref({
  id: undefined,
  status: undefined
})

/** 日期范围 */
const dateRange = ref<[string, string]>()

/** 分页参数 */
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)

/** 加载状态 */
const loading = ref(false)

/** 订单列表数据 */
const orderList = ref<OrderDto[]>([])

/** 当前操作的订单 */
const currentOrder = ref<OrderDto>()

/** 详情弹窗显示状态 */
const detailVisible = ref(false)

/** 发货弹窗显示状态 */
const shipmentVisible = ref(false)

/** 订单状态相关 */
const { orderStatusOptions, getOrderStatusLabel, getOrderStatusType } = useOrderStatus()

/** 查询参数 */
const queryParams = computed(() => ({
  page: page.value,
  pageSize: pageSize.value,
  id: searchForm.value.id,
  status: searchForm.value.status,
  startDate: dateRange.value?.[0],
  endDate: dateRange.value?.[1]
}))

/** 获取订单列表 */
const fetchOrderList = async () => {
  loading.value = true
  try {
    const { list, total: totalCount } = await getOrderList(queryParams.value)
    orderList.value = list
    total.value = totalCount
  } finally {
    loading.value = false
  }
}

/** 搜索 */
const handleSearch = () => {
  page.value = 1
  fetchOrderList()
}

/** 重置 */
const handleReset = () => {
  searchForm.value = {
    id: undefined,
    status: undefined
  }
  dateRange.value = undefined
  handleSearch()
}

/** 查看详情 */
const handleViewDetail = (order: OrderDto) => {
  currentOrder.value = order
  detailVisible.value = true
}

/** 发货 */
const handleShip = (order: OrderDto) => {
  currentOrder.value = order
  shipmentVisible.value = true
}

/** 发货成功回调 */
const handleShipSuccess = () => {
  fetchOrderList()
}

/** 取消订单 */
const handleCancelOrder = async (order: OrderDto) => {
  await ElMessageBox.confirm(i18n.$t('List.index.963864-16').value, i18n.$t('List.index.963864-17').value, {
    type: 'warning'
  })

  await updateOrderStatus(order.id, {
    status: OrderStatus.CANCELED_BY_ADMIN
  })
  ElMessage.success(i18n.$t('List.index.963864-18').value)
  fetchOrderList()
}

/** 分页大小改变 */
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchOrderList()
}

/** 页码改变 */
const handleCurrentChange = (val: number) => {
  page.value = val
  fetchOrderList()
}

// 初始加载
fetchOrderList()
</script>

<style lang="scss" scoped>
.order-list {

  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    background: var(--el-bg-color);
    border-radius: var(--el-border-radius-base);
  }

  .order-item {
    display: flex;
    align-items: center;
    padding: 10px 0;

    &:not(:last-child) {
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    .product-image {
      width: 60px;
      height: 60px;
      margin-right: 10px;
      border-radius: var(--el-border-radius-small);
    }

    .product-info {
      flex: 1;

      .product-title {
        margin-bottom: 5px;
        color: var(--el-text-color-primary);
      }

      .product-price {
        color: var(--el-text-color-secondary);
        font-size: 13px;
      }
    }
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    overflow: auto;
  }
}
</style>
