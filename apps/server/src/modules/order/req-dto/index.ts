
export class CreateOrderDto {
    /** 订单商品列表 */
    items: OrderItemDto[];
    addressId: number;
    remark?: string;
}

/** 订单商品项 */
export class OrderItemDto {
    /** 商品ID */
    productId: number;

    /** 购买数量 */
    quantity: number;
}


export class UpdateOrderStatusDto {
    status: number;
    trackingNumber?: string;
    paymentNo?: string;
}


export class QueryOrderDto {
    id?: number;
    status?: number;
    startDate?: string;
    endDate?: string;
    page?: number;
    pageSize?: number;
}
