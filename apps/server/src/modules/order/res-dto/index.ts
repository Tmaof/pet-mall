// order.dto.ts
export class OrderItemDto {
    id: number;
    productId: number;
    quantity: number;
    titleSnapshot: string;
    mainImageSnapshot: string;
    unitPriceSnapshot: number;
}

export class OrderDto {
    id: number;
    clientId: number;
    totalAmount: number;
    status: number;
    addressSnapshot: any;
    paymentMethod: string;
    paymentTime: Date;
    paymentNo: string;
    shippingMethod: string;
    trackingNumber: string;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItemDto[];
}

export class OrderListDto {
    list: OrderDto[];
    total: number;
}
