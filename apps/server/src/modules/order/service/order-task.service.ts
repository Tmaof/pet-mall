// import { Injectable } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
// import { InjectRepository } from '@nestjs/typeorm';
// import { LessThan, Repository } from 'typeorm';
// import { Order, OrderStatus } from './order.entity';
// import { OrderService } from './order.service';
// import { Payment, PaymentStatus } from './payment.entity';

// @Injectable()
// export class OrderTaskService {
//     constructor (
//         @InjectRepository(Order)
//         private orderRepository: Repository<Order>,
//         @InjectRepository(Payment)
//         private paymentRepository: Repository<Payment>,
//         private orderService: OrderService
//     ) {}

//     /**
//      * 每5分钟执行一次，处理超时未支付订单
//      */
//     @Cron('0 */5 * * * *')
//     async handleTimeoutOrders () {
//         const timeoutLimit = new Date();
//         timeoutLimit.setMinutes(timeoutLimit.getMinutes() - 15); // 15分钟未支付视为超时

//         // 查找超时订单
//         const timeoutOrders = await this.orderRepository.find({
//             where: {
//                 status: OrderStatus.PENDING_PAYMENT,
//                 createdAt: LessThan(timeoutLimit),
//             },
//         });

//         // 处理每个超时订单
//         for (const order of timeoutOrders) {
//             try {
//                 await this.orderService.adminUpdateStatus(order.id, { status: OrderStatus.CANCELED_BY_ADMIN });

//                 // 同时更新对应的支付记录
//                 const payment = await this.paymentRepository.findOne({
//                     where: {
//                         orderId: order.id,
//                         status: PaymentStatus.PENDING,
//                     },
//                 });

//                 if (payment) {
//                     payment.status = PaymentStatus.CLOSED;
//                     await this.paymentRepository.save(payment);
//                 }
//             } catch (error) {
//                 console.error(`处理超时订单 ${order.id} 失败:`, error);
//             }
//         }
//     }
// }
