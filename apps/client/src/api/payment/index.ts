import request from '@/utils/request';
import { CreatePaymentDto } from './req.dto';
import { PaymentDto } from './res.dto';

/** 创建支付 */
export const createPayment = (data: CreatePaymentDto) =>
  request<PaymentDto>({
    url: '/payments',
    method: 'post',
    data,
  });

/** 获取支付状态 */
export const getPaymentStatus = (paymentId: number) =>
  request<PaymentDto>({
    url: `/payments/${paymentId}/status`,
    method: 'get',
  });
