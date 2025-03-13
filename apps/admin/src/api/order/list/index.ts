import request from '@/utility/request'
import type { QueryOrderDto } from './req.dto'
import type { OrderListDto } from './res.dto'

/** 获取订单列表 */
export const getOrderList = (params: QueryOrderDto) => (
  request<OrderListDto>({ url: '/admin/order', method: 'get', params })
)
