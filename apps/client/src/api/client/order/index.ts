import request from '@/utils/request';
import { OrderStatus } from './enum';
import { CreateOrderDto, QueryOrderDto, UpdateOrderStatusByClientDto } from './req.dto';
import { OrderDto, OrderListDto } from './res.dto';

/** 创建订单 */
export const createOrder = (data: CreateOrderDto) =>
  request<OrderDto>({
    url: '/order',
    method: 'POST',
    data,
  });

/** 获取订单列表 */
export const getOrderList = (params?: QueryOrderDto) =>
  request<OrderListDto>({
    url: '/order',
    method: 'GET',
    params,
  });

/** 取消订单 */
export const cancelOrder = (id: number) =>
  request<void>({
    url: `/order/${id}/cancel`,
    method: 'PUT',
  });

/** 更新订单状态 */
export const updateOrderStatus = (id: number, data: UpdateOrderStatusByClientDto) =>
  request({
    url: `/order/${id}/status`,
    method: 'PUT',
    data,
  });

/** 更新订单为确认收货 */
export const confirmOrder = (id: number) =>
  updateOrderStatus(id, { status: OrderStatus.COMPLETED });
