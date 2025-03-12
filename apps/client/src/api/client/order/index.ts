import request from '@/utils/request';
import { CreateOrderDto } from './req.dto';

export const createOrder = (data: CreateOrderDto) =>
  request<void>({
    url: '/order',
    method: 'POST',
    data,
  });
