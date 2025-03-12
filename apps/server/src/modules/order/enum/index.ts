export enum OrderStatus {
    PENDING_PAYMENT = 0,   // 待支付
    PAID = 1,              // 已支付
    PENDING_SHIPMENT = 2,  // 待发货
    SHIPPED = 3,           // 已发货
    COMPLETED = 4,         // 已完成
    CANCELED_BY_CLIENT = 5, // 客户取消
    CANCELED_BY_ADMIN = 6,  // 管理员取消
    FAILED_NO_STOCK = 7     // 失败-库存不足
}
