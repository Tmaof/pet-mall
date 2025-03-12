// import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { DataSource, Repository } from 'typeorm';
// import { Order, OrderStatus } from '../order/order.entity';
// import { CreatePaymentDto } from './dto/req-dto/create-payment.dto';
// import { PaymentDto } from './dto/res-dto/payment.dto';
// import { Payment, PaymentStatus } from './payment.entity';
// import { WechatPayService } from './wechat-pay.service';

// @Injectable()
// export class PaymentService {
//     constructor (
//         @InjectRepository(Payment)
//         private paymentRepository: Repository<Payment>,
//         @InjectRepository(Order)
//         private orderRepository: Repository<Order>,
//         private wechatPayService: WechatPayService,
//         private dataSource: DataSource
//     ) {}

//     /**
//      * 创建支付
//      */
//     async createPayment (clientId: number, createPaymentDto: CreatePaymentDto): Promise<PaymentDto> {
//         const { orderId, payMethod } = createPaymentDto;

//         // 1. 查询订单
//         const order = await this.orderRepository.findOne({ where: { id: orderId, clientId, status: OrderStatus.PENDING_PAYMENT } });

//         if (!order) {
//             throw new BadRequestException('订单不存在或状态错误');
//         }

//         // 2. 检查是否已有支付记录
//         const existingPayment = await this.paymentRepository.findOne({ where: { orderId, status: PaymentStatus.PENDING } });

//         if (existingPayment) {
//             // 如果有未支付的记录，且创建时间在15分钟内，返回已有记录
//             const paymentTime = new Date(existingPayment.createdAt);
//             const currentTime = new Date();
//             const diffMinutes = (currentTime.getTime() - paymentTime.getTime()) / (1000 * 60);

//             if (diffMinutes < 15) {
//                 return {
//                     id: existingPayment.id,
//                     orderId: existingPayment.orderId,
//                     amount: existingPayment.amount,
//                     status: existingPayment.status,
//                     paymentMethod: existingPayment.paymentMethod,
//                     codeUrl: existingPayment.codeUrl,
//                     createdAt: existingPayment.createdAt,
//                 };
//             }
//         }

//         // 3. 创建微信支付参数
//         const outTradeNo = `${orderId}-${Date.now()}`;
//         const wechatPayResult = await this.wechatPayService.createNativePayment({
//             outTradeNo,
//             totalFee: Math.round(order.totalAmount * 100), // 微信支付以分为单位
//             body: `订单${orderId}支付`,
//             notifyUrl: 'https://example.com/api/payments/notify/wechat',
//         });

//         // 4. 创建支付记录
//         const payment = new Payment();
//         payment.orderId = orderId;
//         payment.paymentMethod = payMethod;
//         payment.amount = order.totalAmount;
//         payment.outTradeNo = outTradeNo;
//         payment.status = PaymentStatus.PENDING;
//         payment.codeUrl = wechatPayResult.codeUrl;

//         const savedPayment = await this.paymentRepository.save(payment);

//         return {
//             id: savedPayment.id,
//             orderId: savedPayment.orderId,
//             amount: savedPayment.amount,
//             status: savedPayment.status,
//             paymentMethod: savedPayment.paymentMethod,
//             codeUrl: savedPayment.codeUrl,
//             createdAt: savedPayment.createdAt,
//         };
//     }

//     /**
//      * 查询支付状态
//      */
//     async getPaymentStatus (clientId: number, paymentId: number): Promise<{ status: string }> {
//         const payment = await this.paymentRepository.findOne({
//             where: { id: paymentId },
//             relations: ['order'],
//         });

//         if (!payment || payment.order.clientId !== clientId) {
//             throw new NotFoundException('支付记录不存在');
//         }

//         // 已支付状态直接返回
//         if (payment.status === PaymentStatus.SUCCESS) {
//             return { status: 'SUCCESS' };
//         }

//         // 查询微信支付状态
//         try {
//             const result = await this.wechatPayService.queryPaymentStatus(payment.outTradeNo);
//             if (result.tradeState === 'SUCCESS' && payment.status !== PaymentStatus.SUCCESS) {
//                 // 支付成功，更新支付和订单状态
//                 await this.updatePaymentSuccess(payment.id, result.transactionId);
//                 return { status: 'SUCCESS' };
//             }
//             return { status: payment.status === PaymentStatus.SUCCESS ? 'SUCCESS' : 'PENDING' };
//         } catch (error) {
//             return { status: 'PENDING' };
//         }
//     }

//     /**
//      * 处理微信支付回调
//      */
//     async handleWechatPayNotify (requestData: any): Promise<string> {
//         // 1. 验证签名
//         const notifyData = await this.wechatPayService.parseNotifyData(requestData);

//         // 2. 验证交易结果
//         if (notifyData.result_code === 'SUCCESS') {
//             const outTradeNo = notifyData.out_trade_no;
//             const transactionId = notifyData.transaction_id;

//             // 3. 查询支付记录
//             const payment = await this.paymentRepository.findOne({ where: { outTradeNo } });

//             if (payment && payment.status === PaymentStatus.PENDING) {
//                 // 4. 更新支付状态
//                 await this.updatePaymentSuccess(payment.id, transactionId);
//             }
//         }

//         // 5. 返回成功响应给微信服务器
//         return '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
//     }

//     /**
//      * 更新支付成功状态
//      */
//     private async updatePaymentSuccess (paymentId: number, transactionId: string): Promise<void> {
//         // 使用事务确保数据一致性
//         const queryRunner = this.dataSource.createQueryRunner();
//         await queryRunner.connect();
//         await queryRunner.startTransaction();

//         try {
//             // 1. 查询支付记录
//             const payment = await this.paymentRepository.findOne({
//                 where: { id: paymentId },
//                 relations: ['order'],
//             });

//             if (!payment) {
//                 throw new NotFoundException('支付记录不存在');
//             }

//             // 2. 更新支付记录
//             payment.status = PaymentStatus.SUCCESS;
//             payment.transactionId = transactionId;
//             payment.paidAt = new Date();
//             await queryRunner.manager.save(payment);

//             // 3. 更新订单状态
//             const { order } = payment;
//             order.status = OrderStatus.PAID;
//             order.paymentMethod = payment.paymentMethod;
//             order.paymentTime = payment.paidAt;
//             order.paymentNo = transactionId;
//             await queryRunner.manager.save(order);

//             // 提交事务
//             await queryRunner.commitTransaction();
//         } catch (error) {
//             // 回滚事务
//             await queryRunner.rollbackTransaction();
//             throw error;
//         } finally {
//             // 释放资源
//             await queryRunner.release();
//         }
//     }
// }
