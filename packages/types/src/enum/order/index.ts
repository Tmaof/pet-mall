/**
 * 订单状态。
 * 主流程： 待付款 -【买家支付】 -> 待发货 - 【卖家发货】 -> 已发货 -【买家收货】 -> 已完成
 * 终态： 已取消(买家)、已取消(卖家)、失败(库存不足)、已关闭(超时未支付)
 */
export enum OrderStatus {
    /** 待付款 */
    PENDING_PAYMENT = 1,
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
    /** 已关闭(超时未支付) */
    CLOSED_NO_PAY = 9,
}

/** 订单状态映射 */
export const ORDER_STATUS_MAP = {
    [OrderStatus.PENDING_PAYMENT]: '待付款',
    [OrderStatus.PENDING_SHIPMENT]: '待发货',
    [OrderStatus.SHIPPED]: '已发货',
    [OrderStatus.COMPLETED]: '已完成',
    [OrderStatus.CANCELED_BY_CLIENT]: '已取消(买家)',
    [OrderStatus.CANCELED_BY_ADMIN]: '已取消(卖家)',
    [OrderStatus.FAILED_NO_STOCK]: '失败(库存不足)',
    [OrderStatus.CLOSED_NO_PAY]: '已关闭(超时未支付)',
};

/** 发货方式 */
export enum ShippingMethod {
    /** 快递 */
    EXPRESS = 'express',
    /** 自提 */
    SELF_PICKUP = 'self_pickup',
    /** 卡券 */
    COUPON = 'coupon',
}