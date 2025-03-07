import request from '@/utility/request'
import type { TagDto, TagListDto } from './res-dto'
import type { CreateTagDto, UpdateTagDto } from './req-dto'

/** 获取标签列表 */
export function getTagList(params: { page: number; pageSize: number }) {
  return request<TagListDto>({
    url: '/tag',
    method: 'get',
    params
  })
}

/** 获取所有标签 */
export function getAllTags() {
  return request<TagDto[]>({
    url: '/tag/all',
    method: 'get'
  })
}

/** 创建标签 */
export function createTag(data: CreateTagDto) {
  return request<TagDto>({
    url: '/tag',
    method: 'post',
    data
  })
}

/** 更新标签 */
export function updateTag(id: number, data: UpdateTagDto) {
  return request<TagDto>({
    url: `/tag/${id}`,
    method: 'put',
    data
  })
}

/** 删除标签 */
export function deleteTag(id: number) {
  return request({
    url: `/tag/${id}`,
    method: 'delete'
  })
}
