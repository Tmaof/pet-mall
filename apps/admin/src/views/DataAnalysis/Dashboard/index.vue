<template>
  <div class="dashboard-container">
    <!-- 顶部数据卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日销售额</span>
              <el-tag :type="topStats.salesGrowthRate >= 0 ? 'success' : 'danger'">
                {{ topStats.salesGrowthRate >= 0 ? '+' : '' }}{{ topStats.salesGrowthRate.toFixed(2) }}%
              </el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">¥{{ topStats.totalSales }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>待处理订单</span>
              <el-tag :type="topStats.pendingOrdersGrowthRate >= 0 ? 'success' : 'danger'">
                {{ topStats.pendingOrdersGrowthRate >= 0 ? '+' : '' }}{{ topStats.pendingOrdersGrowthRate.toFixed(2) }}%
              </el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">{{ topStats.pendingOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日订单数</span>
              <el-tag :type="topStats.orderGrowthRate >= 0 ? 'success' : 'danger'">
                {{ topStats.orderGrowthRate >= 0 ? '+' : '' }}{{ topStats.orderGrowthRate.toFixed(2) }}%
              </el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">{{ topStats.todayOrders }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>今日新增用户</span>
              <el-tag :type="topStats.newUsersGrowthRate >= 0 ? 'success' : 'danger'">
                {{ topStats.newUsersGrowthRate >= 0 ? '+' : '' }}{{ topStats.newUsersGrowthRate.toFixed(2) }}%
              </el-tag>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">{{ topStats.newUsers }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 实时交易趋势 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>实时交易趋势</span>
            </div>
          </template>
          <div ref="transactionChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="product-row">
      <!-- 热销商品TOP 5 -->
      <el-col :span="12">
        <el-card shadow="hover" style="height: 100%">
          <template #header>
            <div class="card-header">
              <span>热销商品TOP 5（近30天）</span>
            </div>
          </template>
          <el-table :data="hotProducts" style="width: 100%">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="sales" label="销量" width="100" />
          </el-table>
        </el-card>
      </el-col>
      <!-- 销售分类分布 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售分类分布（近30天）</span>
            </div>
          </template>
          <div ref="salesCategoryChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="product-row">
      <!-- 库存预警 -->
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>库存预警</span>
            </div>
          </template>
          <el-table :data="stockWarnings" style="width: 100%">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="stock" label="库存" width="100" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status === 'low' ? 'danger' : 'warning'">
                  {{ row.status === 'low' ? '库存不足' : '库存积压' }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useECharts } from '@/hooks'
import { computed, watch } from 'vue'
import { getSalesCategoryOption, getTransactionTrendOption } from './hooks/getChartOpt'
import { useDashboardData } from './hooks/useDashboardData'

// 获取仪表盘数据
const { dashboardData } = useDashboardData()

// 图表相关
const { conRef: transactionChartRef, setOpt: setTransactionChartOption } = useECharts()
const { conRef: salesCategoryChartRef, setOpt: setSalesCategoryChartOption } = useECharts()

/** 顶部数据卡片 */
const topStats = computed(() => dashboardData.value?.topStats || {
  totalSales: 0,
  salesGrowthRate: 0,
  pendingOrders: 0,
  pendingOrdersGrowthRate: 0,
  newUsers: 0,
  newUsersGrowthRate: 0,
  todayOrders: 0,
  orderGrowthRate: 0
})
/** 实时交易趋势 */
const transactionTrend = computed(() => dashboardData.value?.transactionTrend || [])
/** 热销商品TOP 5 */
const hotProducts = computed(() => dashboardData.value?.hotProducts || [])
/** 库存预警 */
const stockWarnings = computed(() => dashboardData.value?.stockWarnings || [])
/** 销售分类分布 */
const salesCategories = computed(() => dashboardData.value?.salesCategories || [])

// 监听数据变化，更新图表
watch([transactionTrend, salesCategories], () => {
  if (transactionTrend.value.length) {
    const option = getTransactionTrendOption(transactionTrend.value)
    setTransactionChartOption(option)
  }
  if (salesCategories.value.length) {
    const option = getSalesCategoryOption(salesCategories.value)
    setSalesCategoryChartOption(option)
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.dashboard-container {

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .card-body {
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: var(--theme-text-primary);
    }
  }

  .chart-row {
    margin-top: 20px;
  }

  .product-row {
    margin-top: 20px;
  }

  .chart {
    height: 300px;
  }
}
</style>
