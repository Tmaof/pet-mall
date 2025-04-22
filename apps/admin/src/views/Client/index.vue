<template>
  <div class="client-container">
    <SearchForm v-model="queryParams" @search="handleSearch" />

    <ClientTable :data="tableData" :loading="loading" :total="total" @refresh="refresh" />

    <div class="pagination-container">
      <el-pagination v-model:current-page="page" v-model:page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
        :total="total" layout="total, sizes, prev, pager, next, jumper" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import ClientTable from './components/ClientTable/index.vue'
import SearchForm from './components/SearchForm/index.vue'
import { useClientList } from './hooks/useClientList'

const {
  loading,
  queryParams,
  tableData,
  total,
  fetchData,
  refresh,
  page,
  pageSize
} = useClientList()

/** 搜索 */
const handleSearch = () => {
  page.value = 1
  refresh()
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss" scoped>
.client-container {
  min-height: 100%;
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
}
}
</style>
