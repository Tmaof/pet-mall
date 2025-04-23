<template>
  <div class="sales-analysis">
    <!-- 顶部筛选区域 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-tooltip content="默认查询最近7天数据">
          <el-form-item label="时间范围">
            <el-date-picker v-model="filterForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" value-format="YYYY-MM-DD" @change="handleDateRangeChange" />
          </el-form-item>
        </el-tooltip>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 核心指标卡片 -->
    <div  class="core-indicator-card">
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>总销售额</span>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">¥{{ coreMetrics.totalSales }}</div>
          </div>
        </el-card>
      </div>
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单总量</span>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">{{ coreMetrics.totalOrders }}</div>
          </div>
        </el-card>
      </div>
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>客单价</span>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">¥{{ Number(coreMetrics.averageOrderValue).toFixed(2) }}</div>
          </div>
        </el-card>
      </div>
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>未支付订单</span>
            </div>
          </template>
          <div class="card-body">
            <div class="amount">{{ coreMetrics.unpaidOrders }}</div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 销售趋势图 -->
    <div  class="sale-trend">
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>销售趋势</span>
            </div>
          </template>
          <div ref="salesTrendChartRef" class="chart"></div>
        </el-card>
      </div>
    </div>

    <!-- 分布图表 -->
    <div  class="distribution-chart">
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单状态分布</span>
            </div>
          </template>
          <div ref="orderStatusChartRef" class="chart"></div>
        </el-card>
      </div>
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>支付方式分布</span>
            </div>
          </template>
          <div ref="paymentMethodChartRef" class="chart"></div>
        </el-card>
      </div>
    </div>

    <!-- 商品类别和地域分布 -->
    <div  class="product-category-and-region">
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>商品类别销售分布</span>
            </div>
          </template>
          <div ref="categorySalesChartRef" class="chart"></div>
        </el-card>
      </div>
      <div >
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>地域销售分布</span>
            </div>
          </template>
          <div ref="regionSalesChartRef" class="chart"></div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useECharts } from '@/hooks'
import { computed, ref, watch } from 'vue'
import {
  getCategorySalesOption,
  getOrderStatusOption,
  getPaymentMethodOption,
  getRegionSalesOption,
  getSalesTrendOption
} from './hooks/getChartOpt'
import { useSalesData } from './hooks/useSalesData'

// 筛选表单
const filterForm = ref({
  dateRange: ['', '']
})

// 获取销售数据
const { salesData, fetchSalesData } = useSalesData()

/** 核心指标 */
const coreMetrics = computed(() => salesData.value?.coreMetrics || {
  totalSales: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  unpaidOrders: 0
})

// 图表相关
const { conRef: salesTrendChartRef, setOpt: setSalesTrendChartOption } = useECharts()
const { conRef: orderStatusChartRef, setOpt: setOrderStatusChartOption } = useECharts()
const { conRef: paymentMethodChartRef, setOpt: setPaymentMethodChartOption } = useECharts()
const { conRef: categorySalesChartRef, setOpt: setCategorySalesChartOption } = useECharts()
const { conRef: regionSalesChartRef, setOpt: setRegionSalesChartOption } = useECharts()

// 处理日期范围变化
const handleDateRangeChange = (val: [string, string]) => {
  if (val) {
    filterForm.value.dateRange = val
  }
}

/** 处理搜索 */
const handleSearch = () => {
  const [startTime, endTime] = filterForm.value.dateRange
  fetchSalesData({
    startTime: startTime ? new Date(startTime) : undefined,
    endTime: endTime ? new Date(endTime) : undefined
  })
}

/** 处理重置 */
const handleReset = () => {
  filterForm.value.dateRange = []
  fetchSalesData()
}

// 监听数据变化，更新图表
watch(() => salesData.value, (newVal) => {
  if (!newVal) return

  // 更新销售趋势图
  if (newVal.salesTrend) {
    setSalesTrendChartOption(getSalesTrendOption(newVal.salesTrend))
  }

  // 更新订单状态分布图
  if (newVal.orderStatusDistribution) {
    setOrderStatusChartOption(getOrderStatusOption(newVal.orderStatusDistribution))
  }

  // 更新支付方式分布图
  if (newVal.paymentMethodDistribution) {
    setPaymentMethodChartOption(getPaymentMethodOption(newVal.paymentMethodDistribution))
  }

  // 更新商品类别销售分布图
  if (newVal.categorySalesDistribution) {
    setCategorySalesChartOption(getCategorySalesOption(newVal.categorySalesDistribution))
  }

  // 更新地域销售分布图
  if (newVal.regionSalesDistribution) {
    setRegionSalesChartOption(getRegionSalesOption(newVal.regionSalesDistribution))
  }
}, { immediate: true })

</script>

<style lang="scss" scoped>
@import '@/style/variables.scss';

.sales-analysis {
  .filter-card {
    margin-bottom: 20px;
  }
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

  .chart {
    height: 300px;
  }

  .core-indicator-card{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }

  .sale-trend{
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(1,1fr);
    gap: 20px;
  }

  .distribution-chart,.product-category-and-region{
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @media (max-width: $mobile-breakpoint) {
    .core-indicator-card{
      grid-template-columns: repeat(2, 1fr);
    }
    .distribution-chart,.product-category-and-region{
      grid-template-columns: repeat(1, 1fr);
    }
  }
}
</style>
