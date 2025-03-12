import request from '@/utils/request';
import { CreateOrderDto, QueryOrderDto } from './req.dto';
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
