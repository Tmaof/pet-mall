// order.dto.ts
import { PaymentMethod } from '@/modules/payment/enum';
import { ShippingMethod } from '../enum';

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
    paymentMethod: PaymentMethod;
    paymentTime: Date;
    paymentNo: string;
    shippingMethod: ShippingMethod;
    trackingNumber: string;
    shippingCompany: string;
    remark: string;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItemDto[];
}

export class OrderListDto {
    list: OrderDto[];
    total: number;
}
