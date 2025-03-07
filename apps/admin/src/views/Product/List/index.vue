<template>
  <div class="product-list">
    <!-- 搜索表单 -->
    <el-card class="search-card" shadow="never">
      <el-form :model="searchForm" inline>
        <el-form-item :label="$t('List.index.303665-0')">
          <el-input v-model.number="searchForm.id" :placeholder="$t('List.index.303665-1')" />
        </el-form-item>
        <el-form-item :label="$t('List.index.303665-2')">
          <el-input v-model="searchForm.title" :placeholder="$t('List.index.303665-3')" />
        </el-form-item>
        <el-form-item :label="$t('List.index.303665-4')">
          <el-cascader
            v-model="searchForm.categoryId"
            :options="categoryTree"
            :props="{ value: 'id', label: 'name' }"
            :placeholder="$t('List.index.303665-5')"
            clearable
          />
        </el-form-item>
        <!-- <el-form-item label="价格区间">
          <el-input-number
            v-model="searchForm.minPrice"
            :min="0"
            :precision="2"
            placeholder="最小价格"
          />
          <span class="mx-2">-</span>
          <el-input-number
            v-model="searchForm.maxPrice"
            :min="0"
            :precision="2"
            placeholder="最大价格"
          />
        </el-form-item>
        <el-form-item label="库存区间">
          <el-input-number
            v-model="searchForm.minStock"
            :min="0"
            :precision="0"
            placeholder="最小库存"
          />
          <span class="mx-2">-</span>
          <el-input-number
            v-model="searchForm.maxStock"
            :min="0"
            :precision="0"
            placeholder="最大库存"
          />
        </el-form-item> -->
        <el-form-item :label="$t('List.index.303665-6')">
          <el-switch v-model="searchForm.isOnSale" />
        </el-form-item>
        <el-form-item :label="$t('List.index.303665-7')">
          <el-date-picker
            v-model="searchForm.createdRange"
            type="daterange"
            range-separator="-"
            :start-placeholder="$t('List.index.303665-8')"
            :end-placeholder="$t('List.index.303665-9')"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">{{ $t('List.index.303665-10') }}</el-button>
          <el-button @click="handleReset">{{ $t('List.index.303665-11') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card class="table-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>{{ $t('List.index.303665-12') }}</span>
          <div>
            <el-button type="primary" @click="$router.push('/product/add')">
              {{ $t('List.index.303665-13') }}
            </el-button>
            <el-button type="info" @click="handleRefresh">
              {{ $t('List.index.303665-14') }}
            </el-button>
          </div>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="productList"
        border
        style="width: 100%"
      >
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" :label="$t('List.index.303665-2')" min-width="200" show-overflow-tooltip />
        <el-table-column prop="categoryName" :label="$t('List.index.303665-4')" width="120" />
        <el-table-column prop="mainImage" :label="$t('List.index.303665-15')" width="100">
          <template #default="{ row }">
            <el-image
              :src="row.mainImage"
              :preview-src-list="[row.mainImage]"
              fit="cover"
              class="product-image"
            />
          </template>
        </el-table-column>
        <el-table-column prop="price" :label="$t('List.index.303665-16')" width="120">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" :label="$t('List.index.303665-17')" width="100" />
        <el-table-column prop="isOnSale" :label="$t('List.index.303665-18')" width="100">
          <template #default="{ row }">
            <el-tag :type="row.isOnSale ? 'success' : 'info'">
              {{ row.isOnSale ? $t('List.index.303665-19') : $t('List.index.303665-20') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="$t('List.index.303665-7')" width="180">
          <template #default="{ row }">
            {{ dateFilter(row.createdAt, 'YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('List.index.303665-21')" fixed="right" min-width="120">
          <template #default="{ row }">
            <el-button link type="primary" @click="handleEdit(row)">
              {{ $t('List.index.303665-22') }}
            </el-button>
            <el-button link type="danger" @click="handleDelete(row)">
              {{ $t('List.index.303665-23') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          :current-page="searchForm.page"
          :page-size="searchForm.pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onActivated } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useProductList } from './hooks/useProductList'
import { getCategoryTree } from '@/api/product/category/category'
import type { GetCategoryTreeResDto } from '@/api/product/category/res-dto'
import type { ProductDto } from '@/api/product/product/res-dto'
import { dateFilter } from '@/filter/index'

const router = useRouter()
const route = useRoute()
const categoryTree = ref<GetCategoryTreeResDto[]>([])

const {
  loading,
  productList,
  total,
  searchForm,
  fetchProductList,
  handleSearch,
  handleReset,
  handleSizeChange,
  handlePageChange,
  handleDelete
} = useProductList()

/** 获取分类树 */
const fetchCategoryTree = async () => {
  categoryTree.value = await getCategoryTree()
}

/** 编辑商品 */
const handleEdit = (row: ProductDto) => {
  router.push({
    name: 'product-edit',
    params: { id: row.id }
  })
}

/** 刷新 */
function handleRefresh() {
  fetchCategoryTree()
  fetchProductList()
}

onMounted(() => {
  handleRefresh()
})

onActivated(() => {
  // 如果路由参数中包含 refresh 参数，则刷新页面
  if (route.query.refresh) {
    handleRefresh()
  }
})
</script>

<style lang="scss" scoped>
.product-list {

  .search-card {
    margin-bottom: 20px;
  }

  .table-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .product-image {
    width: 60px;
    height: 60px;
    border-radius: 4px;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    overflow-x: auto;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  .mx-2 {
    margin: 0 8px;
  }
}
</style>
