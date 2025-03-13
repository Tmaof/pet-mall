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
    /** 已关闭(超时未支付) */
    CLOSED_NO_PAY = 9,
}
