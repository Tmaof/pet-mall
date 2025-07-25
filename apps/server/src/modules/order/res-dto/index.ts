export * from 'server-types';

// // order.dto.ts
// import { PaymentMethod } from '@/modules/payment/enum';
// import { ShippingMethod } from '../enum';
// import { Client } from '@/modules/client/client/client.entity';

// export class OrderItemDto {
//     id: number;
//     productId: number;
//     quantity: number;
//     titleSnapshot: string;
//     mainImageSnapshot: string;
//     unitPriceSnapshot: number;
// }

// export class AddressSnapshotDto {
//     consignee: string;
//     phone: string;
//     province: string;
//     city: string;
//     district: string;
//     detail: string;
// }

// export class ClientOrderDto {
//     id: number;
//     clientId: number;
//     totalAmount: number;
//     status: number;
//     addressSnapshot: AddressSnapshotDto;
//     paymentMethod: PaymentMethod;
//     paymentTime: Date;
//     paymentNo: string;
//     shippingMethod: ShippingMethod;
//     trackingNumber: string;
//     shippingCompany: string;
//     remark: string;
//     createdAt: Date;
//     updatedAt: Date;
//     orderItems: OrderItemDto[];
// }

// export class ClientOrderListDto {
//     list: ClientOrderDto[];
//     total: number;
// }


// export class AdminOrderDto extends ClientOrderDto {
//     client: Client;
// }

// export class AdminOrderListDto {
//     list: AdminOrderDto[];
//     total: number;
// }
