import type { QueryClientListDto } from './req-dto'
import request from '@/utility/request'
import type { ClientListDto } from './res-dto'
/**
 * 获取客户列表
 */
export function getClientList(params: QueryClientListDto): Promise<ClientListDto> {
  return request({
    url: '/admin-client/list',
    method: 'GET',
    params
  })
}

/**
 * 禁用客户
 */
export function disableClient(id: number) {
  return request({
    url: '/admin-client/disable',
    method: 'POST',
    data: { id }
  })
}

/** 启用客户 */
export function enableClient(id: number) {
  return request({
    url: '/admin-client/enable',
    method: 'POST',
    data: { id }
  })
}
