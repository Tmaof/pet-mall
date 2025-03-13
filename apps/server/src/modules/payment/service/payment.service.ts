import { Order, } from '@/modules/order/entity/order.entity';
import { OrderStatus } from '@/modules/order/enum';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, LessThan, Repository } from 'typeorm';
import { PAYMENT_TYPE_MAP, PaymentStatus } from '../enum';
import { Payment } from '../payment.entity';
import { CreatePaymentDto, NotifyData } from '../req-dto';
import { PaymentDto } from '../res-dto';
import { H5payService, PAYMENT_CONFIG } from './h5pay.service';

@Injectable()
export class PaymentService {
    constructor (
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        private h5payService: H5payService,
        private dataSource: DataSource,
    ) {}

    /**
     * 创建支付
     */
    async createPayment (clientId: number, createPaymentDto: CreatePaymentDto): Promise<PaymentDto> {
        const { orderId, payMethod } = createPaymentDto;

        // 1. 查询订单
        const order = await this.orderRepository.findOne({
            where: {
                id: orderId,
                clientId,
            },
        });

        if (!order) {
            throw new BadRequestException('订单不存在');
        }

        // 2. 检查是否已有支付记录
        const existingPayment = await this.paymentRepository.findOne({ where: { order } });

        if (existingPayment) {
            // 如果有未支付的记录，且创建时间在xx分钟内，返回已有记录
            if (existingPayment.status === PaymentStatus.PENDING) {
                const paymentTime = new Date(existingPayment.createdAt);
                const currentTime = new Date();
                const diffMinutes = (currentTime.getTime() - paymentTime.getTime()) / (1000 * 60);

                if (diffMinutes < PAYMENT_CONFIG.EXPIRE_TIME) {
                    return this.toPaymentDto(existingPayment);
                }
            }

            // 一个订单 只 允许创建一次支付记录
            // 如果有已支付的记录，返回错误
            new Error('该订单已有支付的记录，不能重复创建');
        }

        // 3. 创建支付参数
        const outTradeNo = `${orderId}-${Date.now()}`;
        const h5payResult = await this.h5payService.createPayment({
            outTradeNo,
            description: `订单${orderId}支付`,
            payType: PAYMENT_TYPE_MAP[payMethod],
            amount: Math.round(order.totalAmount * 100), // 转换为分
        });

        // 4. 创建支付记录
        const payment = new Payment();
        payment.order = order;
        payment.paymentMethod = payMethod;
        payment.amount = order.totalAmount;
        payment.outTradeNo = outTradeNo;
        payment.status = PaymentStatus.PENDING;
        payment.codeUrl = h5payResult.code_url;

        const savedPayment = await this.paymentRepository.save(payment);

        return this.toPaymentDto(savedPayment);
    }

    /**
     * 查询支付状态。
     * 查询支付状态 严禁使用此接口做订单状态的循环查询，否则将自动导致IP进入黑名单！
     * 每天限制查询100次
     * @param paymentId 支付ID
     * @param isTest 是否为测试使用
     */
    async getPaymentStatus (clientId: number, paymentId: number, isTest: string): Promise<PaymentDto> {
        const payment = await this.paymentRepository.findOne({
            where: { id: paymentId },
            relations: ['order'],
        });

        if (!payment || payment.order.clientId !== clientId) {
            throw new NotFoundException('支付记录不存在');
        }

        // 不是测试，线上使用
        if (!isTest) {
            return this.toPaymentDto(payment);
        }

        // 测试使用
        // 查询支付状态
        const { in_trade_no, trade_status, trade_no } = await this.h5payService.queryPayment({ outTradeNo: payment.outTradeNo });
        let pay = payment;
        if (trade_status === 'success') {
            // 支付成功，更新支付和订单状态
            pay = await this.updatePaymentSuccess(payment.id, in_trade_no, trade_no);
        }

        return this.toPaymentDto(pay);
    }

    /**
     * 处理支付回调
     */
    async handlePaymentNotify (notifyData: NotifyData): Promise<string> {
        const { success, resData } = await this.h5payService.VerifyPaymentNotify(notifyData);
        if (success) {
            const { out_trade_no, in_trade_no, trade_no } = notifyData;
            const payment = await this.paymentRepository.findOne({
                where: { outTradeNo: out_trade_no },
                relations: ['order'],
            });
            if (payment) {
                await this.updatePaymentSuccess(payment.id, in_trade_no, trade_no);
            }
        }
        return resData;
    }

    /**
     * 更新支付成功状态
     */
    private async updatePaymentSuccess (paymentId: number, transactionId: string, agencyTransactionId: string): Promise<Payment> {
        // 使用事务确保数据一致性
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 查询支付记录
            const payment = await this.paymentRepository.findOne({
                where: { id: paymentId },
                relations: ['order'],
            });

            if (!payment) {
                throw new NotFoundException('支付记录不存在');
            }

            // 2. 更新支付记录
            payment.status = PaymentStatus.SUCCESS;
            payment.transactionId = transactionId;
            payment.agencyTransactionId = agencyTransactionId;
            payment.paidAt = new Date();
            await queryRunner.manager.save(payment);

            // 3. 更新订单状态
            const { order } = payment;
            order.status = OrderStatus.PAID;
            order.paymentTime = payment.paidAt;
            order.paymentNo = transactionId;
            await queryRunner.manager.save(order);

            // 提交事务
            await queryRunner.commitTransaction();
            return payment;
        } catch (error) {
            // 回滚事务
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            // 释放资源
            await queryRunner.release();
        }
    }

    /**
     * 转换为支付DTO
     */
    private toPaymentDto (payment: Payment): PaymentDto {
        return {
            id: payment.id,
            orderId: payment.order.id,
            amount: payment.amount,
            status: payment.status,
            paymentMethod: payment.paymentMethod,
            codeUrl: payment.codeUrl,
            createdAt: payment.createdAt,
            transactionId: payment.transactionId,
        };
    }

    /**
     * 每5分钟执行一次，处理超时未支付的支付记录 和 订单记录
     */
    @Cron('0 */5 * * * *')
    async handleTimeoutPayments () {
        const now = new Date();
        const fiveMinutesAgo = new Date(now.getTime() - (PAYMENT_CONFIG.EXPIRE_TIME * 60 * 1000));
        // 查询超时未支付的支付记录
        const timeoutPayments = await this.paymentRepository.find({
            where: {
                status: PaymentStatus.PENDING,
                createdAt: LessThan(fiveMinutesAgo),
            },
        });
        // 处理超时未支付的支付记录
        for (const payment of timeoutPayments) {
            // 1. 更新支付记录状态为已关闭
            payment.status = PaymentStatus.CLOSED_NO_PAY;
            await this.paymentRepository.save(payment);
            // 2. 更新订单状态为 已关闭(超时未支付)
            const { order } = payment;
            order.status = OrderStatus.CLOSED_NO_PAY;
            await this.orderRepository.save(order);
        }
    }
}
