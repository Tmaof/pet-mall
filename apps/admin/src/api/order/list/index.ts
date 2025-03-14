import request from '@/utility/request'
import type { QueryOrderDto, UpdateOrderStatusDto } from './req.dto'
import type { OrderListDto } from './res.dto'

/** 获取订单列表 */
export const getOrderList = (params: QueryOrderDto) => (
  request<OrderListDto>({ url: '/admin/order', method: 'get', params })
)

/** 更新订单状态 */
export const updateOrderStatus = (orderId: number, data: UpdateOrderStatusDto) => (
  request<void>({
    url: `/admin/order/${orderId}/status`,
    method: 'put',
    data
  })
)
