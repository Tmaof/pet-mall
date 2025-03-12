/** 订单状态 */
export enum OrderStatus {
  /** 待付款 */
  PENDING_PAYMENT = 1,
  /** 已支付 */
  PAID = 2,
  /** 待发货 */
  PENDING_SHIPMENT = 3,
  /** 已发货 */
  SHIPPED = 4,
  /** 已完成 */
  COMPLETED = 5,
  /** 已取消(买家) */
  CANCELED_BY_CLIENT = 6,
  /** 已取消(卖家) */
  CANCELED_BY_ADMIN = 7,
  /** 失败(库存不足) */
  FAILED_NO_STOCK = 8,
}

/** 订单状态标签 */
export const ORDER_STATUS_LABELS = {
  [OrderStatus.PENDING_PAYMENT]: '待付款',
  [OrderStatus.PAID]: '已支付',
  [OrderStatus.PENDING_SHIPMENT]: '待发货',
  [OrderStatus.SHIPPED]: '已发货',
  [OrderStatus.COMPLETED]: '已完成',
  [OrderStatus.CANCELED_BY_CLIENT]: '已取消(买家)',
  [OrderStatus.CANCELED_BY_ADMIN]: '已取消(卖家)',
  [OrderStatus.FAILED_NO_STOCK]: '失败(库存不足)',
} as const;

/** 订单状态标签颜色 */
export const ORDER_STATUS_COLORS = {
  [OrderStatus.PENDING_PAYMENT]: 'warning',
  [OrderStatus.PAID]: 'processing',
  [OrderStatus.PENDING_SHIPMENT]: 'processing',
  [OrderStatus.SHIPPED]: 'processing',
  [OrderStatus.COMPLETED]: 'success',
  [OrderStatus.CANCELED_BY_CLIENT]: 'default',
  [OrderStatus.CANCELED_BY_ADMIN]: 'default',
  [OrderStatus.FAILED_NO_STOCK]: 'error',
} as const;
