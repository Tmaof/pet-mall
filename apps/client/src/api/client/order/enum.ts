export { OrderStatus, ShippingMethod } from 'server-types/enum';
import { ORDER_STATUS_MAP, OrderStatus } from 'server-types/enum';

/** 订单状态标签 */
export const ORDER_STATUS_LABELS = ORDER_STATUS_MAP;

/** 订单状态标签颜色 */
export const ORDER_STATUS_COLORS = {
  [OrderStatus.PENDING_PAYMENT]: 'warning',
  [OrderStatus.PENDING_SHIPMENT]: 'processing',
  [OrderStatus.SHIPPED]: 'processing',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.CANCELED_BY_CLIENT]: 'default',
  [OrderStatus.CANCELED_BY_ADMIN]: 'default',
  [OrderStatus.FAILED_NO_STOCK]: 'error',
  [OrderStatus.CLOSED_NO_PAY]: 'default',
} as const;
