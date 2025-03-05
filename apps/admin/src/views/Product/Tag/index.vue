<template>
  <el-card>
    <div class="tag-container">
      <!-- 顶部操作栏 -->
      <div class="operation-bar">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>{{ $t('Tag.index.752337-0') }}
        </el-button>
      </div>

      <!-- 标签列表 -->
      <el-table v-loading="loading" :data="tagList" border class="tag-table">
        <el-table-column type="index" :label="$t('Tag.index.752337-1')" width="80" align="center" />
        <el-table-column prop="name" :label="$t('Tag.index.752337-2')" min-width="200" />
        <el-table-column :label="$t('Tag.index.752337-3')" align="center" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" @click="handleEdit(row)" link>
                <el-icon><Edit /></el-icon>{{ $t('Tag.index.752337-4') }}
              </el-button>
              <el-button type="danger" @click="handleDeleteConfirm(row)" link>
                <el-icon><Delete /></el-icon>{{ $t('Tag.index.752337-5') }}
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>

      <!-- 标签编辑对话框 -->
      <tag-dialog
        v-model="dialogVisible"
        :mode="dialogMode"
        :tag="currentTag"
        @success="handleDialogSuccess"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import TagDialog from './components/TagDialog.vue'
import { useTagList } from './hooks/useTagList'
import type { TagDto } from '@/api/product/tag/res-dto'
import i18n from '@/i18n'

// 对话框相关状态
const dialogVisible = ref(false)
const dialogMode = ref<'create' | 'edit'>('create')
const currentTag = ref<TagDto>()

// 使用标签列表 hook
const {
  loading,
  total,
  tagList,
  page,
  pageSize,
  fetchTagList,
  handleDelete,
  handlePageChange,
  handleSizeChange
} = useTagList()

// 添加标签
const handleAdd = () => {
  dialogMode.value = 'create'
  currentTag.value = undefined
  dialogVisible.value = true
}

// 编辑标签
const handleEdit = (row: TagDto) => {
  dialogMode.value = 'edit'
  currentTag.value = row
  dialogVisible.value = true
}

// 删除标签确认
const handleDeleteConfirm = async (row: TagDto) => {
  try {
    await ElMessageBox.confirm(i18n.$t('Tag.index.752337-6').value, i18n.$t('Tag.index.752337-7').value, {
      confirmButtonText: i18n.$t('Tag.index.752337-8').value,
      cancelButtonText: i18n.$t('Tag.index.752337-9').value,
      type: 'warning'
    })
    await handleDelete(row.id)
  } catch (error) {
    // 用户取消删除，不做处理
  }
}

// 对话框操作成功的回调
const handleDialogSuccess = () => {
  fetchTagList()
}

// 初始加载数据
onMounted(() => {
  fetchTagList()
})
</script>

<style lang="scss" scoped>
.tag-container {
  background-color: var(--theme-bg-container);

  .operation-bar {
    margin-bottom: 10px;
  }

  .tag-table {
    margin-bottom: 20px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    overflow: auto;
  }
}
</style>
