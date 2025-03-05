import request from '@/utility/request'
import { GetCategoryTreeResDto } from './res-dto'

/** 获取分类树 */
export function getCategoryTree() {
  return request<GetCategoryTreeResDto[]>({
    url: '/category/tree',
    method: 'get'
  })
}

/** 创建分类 */
export function createCategory(data: any) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

/** 更新分类 */
export function updateCategory(id: number, data: any) {
  return request({
    url: `/category/${id}`,
    method: 'put',
    data
  })
}

/** 删除分类 */
export function deleteCategoryById(id: number) {
  return request({
    url: `/category/${id}`,
    method: 'delete'
  })
}
