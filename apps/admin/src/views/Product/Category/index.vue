<template>
  <el-card shadow="never">
    <div class="category-container">
      <!-- 顶部操作栏 -->
      <div class="operation-bar">
        <el-button type="primary" @click="handleAddCategory">
          <el-icon>
            <Plus /> </el-icon
          >{{ $t('Category.index.543947-0') }}
        </el-button>
      </div>

      <!-- 分类表格树 -->
      <el-table
        :data="categoryTree"
        row-key="id"
        border
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        class="category-table"
      >
        <el-table-column prop="name" :label="$t('Category.index.543947-1')" min-width="200" />
        <el-table-column
          prop="sortOrder"
          :label="$t('Category.index.543947-2')"
          width="100"
          align="center"
        />
        <el-table-column
          prop="isVisible"
          :label="$t('Category.index.543947-3')"
          width="100"
          align="center"
        >
          <template #default="{ row }">
            <el-tag :type="row.isVisible ? 'success' : 'info'">
              {{ row.isVisible ? $t('Category.index.543947-4') : $t('Category.index.543947-5') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Category.index.543947-6')" align="center" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="handleEdit(row)" link>
                <el-icon>
                  <Edit /> </el-icon
                >{{ $t('Category.index.543947-7') }}
              </el-button>
              <el-button type="primary" @click="handleAddSub(row)" link>
                <el-icon>
                  <Plus /> </el-icon
                >{{ $t('Category.index.543947-8') }}
              </el-button>
              <el-button type="danger" @click="handleDelete(row)" link>
                <el-icon>
                  <Delete /> </el-icon
                >{{ $t('Category.index.543947-9') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分类编辑对话框 -->
      <category-dialog
        v-model="dialogVisible"
        :category="currentCategory"
        :parent-category="parentCategory"
        :mode="dialogMode"
        @success="handleDialogSuccess"
      />
    </div>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import CategoryDialog from './components/CategoryDialog.vue'
import { useCategoryList } from './hooks/useCategoryList'
import i18n from '@/i18n'

// 获取分类列表数据和相关方法
const { categoryTree, fetchCategoryList, deleteCategory } = useCategoryList()

// 对话框相关状态
const dialogVisible = ref(false)
const dialogMode = ref('create')
const currentCategory = ref(null)
const parentCategory = ref(null)

// 添加根分类
const handleAddCategory = () => {
  dialogMode.value = 'create'
  currentCategory.value = null
  parentCategory.value = null
  dialogVisible.value = true
}

// 添加子分类
const handleAddSub = (row) => {
  dialogMode.value = 'create'
  currentCategory.value = null
  parentCategory.value = row
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  dialogMode.value = 'edit'
  currentCategory.value = { ...row }
  parentCategory.value = null
  dialogVisible.value = true
}

// 删除分类
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      i18n.$t('Category.index.543947-10').value,
      i18n.$t('Category.index.543947-11').value,
      {
        confirmButtonText: i18n.$t('Category.index.543947-12'),
        cancelButtonText: i18n.$t('Category.index.543947-13'),
        type: 'warning'
      }
    )

    await deleteCategory(row.id)
    ElMessage.success(i18n.$t('Category.index.543947-14').value)
    fetchCategoryList()
  } catch (error) {
    console.error(error)
  }
}

// 对话框操作成功的回调
const handleDialogSuccess = () => {
  fetchCategoryList()
}

// 初始加载数据
onMounted(() => {
  fetchCategoryList()
})
</script>

<style lang="scss" scoped>
.category-container {
  background-color: var(--theme-bg-container);

  .operation-bar {
    margin-bottom: 10px;
  }

  .category-table {
    :deep(.el-table__row) {
      .cell {
        .el-button-group {
          .el-button {
            padding: 4px 8px;
            margin: 0 4px;
          }
        }
      }
    }
  }
}
</style>
