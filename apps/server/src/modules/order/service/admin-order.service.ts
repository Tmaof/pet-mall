import { Address } from '@/modules/client/address/address.entity';
import { Product } from '@/modules/product/product/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { OrderStatus, ShippingMethod } from '../enum';
import { QueryOrderDto, UpdateOrderStatusDto } from '../req-dto';
import { AdminOrderDto, AdminOrderListDto } from '../res-dto';
import { validateStatusChange } from '../utils';

@Injectable()
export class AdminOrderService {
    constructor (
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
        private dataSource: DataSource
    ) {}

    /**
     * 查询订单列表
     */
    async findAll (clientId: number, queryOrderDto: QueryOrderDto): Promise<AdminOrderListDto> {
        const {
            id,
            status,
            startDate,
            endDate,
            page = 1,
            pageSize = 10,
        } = queryOrderDto;

        // 构建查询条件
        const where: any = { clientId };
        if (id) where.id = id;
        if (status !== undefined) where.status = status;

        // 日期范围查询
        if (startDate && endDate) {
            where.createdAt = Between(new Date(startDate), new Date(endDate));
        }

        // 执行查询
        const [orders, total] = await this.orderRepository.findAndCount({
            where,
            relations: ['orderItems', 'client'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        // 转换为DTO
        const orderDtos = orders.map(order => this.toOrderDto(order));

        return {
            list: orderDtos,
            total,
        };
    }

    /**
     * 查询单个订单
     */
    async findOne (clientId: number, id: number): Promise<AdminOrderDto> {
        const order = await this.orderRepository.findOne({
            where: { id, clientId },
            relations: ['orderItems', 'client'],
        });

        if (!order) {
            throw new NotFoundException('订单不存在');
        }

        return this.toOrderDto(order);
    }

    /**
     * 【管理员】更新订单状态
     */
    async adminUpdateStatus (id: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<AdminOrderDto> {
        const { status, trackingNumber, shippingCompany } = updateOrderStatusDto;

        // 使用事务进行更新
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 验证订单存在
            const order = await this.orderRepository.findOne({
                where: { id },
                relations: ['orderItems', 'client'],
            });

            if (!order) {
                throw new NotFoundException('订单不存在');
            }

            // 2. 验证状态更新的合法性
            validateStatusChange(order.status, status);

            // 3. 更新订单状态
            order.status = status;

            // 如果是取消订单，需要归还库存
            if (status === OrderStatus.CANCELED_BY_ADMIN) {
                // 待支付状态的订单取消才需要归还库存
                // 已支付，取消订单，需要归还库存
                // if (order.status === OrderStatus.PENDING_PAYMENT) {
                for (const item of order.orderItems) {
                    const product = await this.productRepository.findOne({ where: { id: item.productId } });
                    if (product) {
                        product.stock += item.quantity;
                        await queryRunner.manager.save(product);
                    }
                }
            }

            // 5. 更新物流信息
            if (status === OrderStatus.SHIPPED && trackingNumber && shippingCompany) {
                order.trackingNumber = trackingNumber;
                order.shippingCompany = shippingCompany;
                order.shippingMethod = ShippingMethod.EXPRESS;
            }

            // 6. 保存更新
            await queryRunner.manager.save(order);

            // 提交事务
            await queryRunner.commitTransaction();

            // 返回更新后的订单
            return this.toOrderDto(order);
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
     * 转换为DTO
     */
    private toOrderDto (order: Order): AdminOrderDto {
        return {
            id: order.id,
            clientId: order.clientId,
            client: order.client,
            totalAmount: order.totalAmount,
            status: order.status,
            addressSnapshot: order.addressSnapshot,
            paymentMethod: order.paymentMethod,
            paymentTime: order.paymentTime,
            paymentNo: order.paymentNo,
            shippingMethod: order.shippingMethod,
            trackingNumber: order.trackingNumber,
            shippingCompany: order.shippingCompany,
            remark: order.remark,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            orderItems: order.orderItems.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                titleSnapshot: item.titleSnapshot,
                mainImageSnapshot: item.mainImageSnapshot,
                unitPriceSnapshot: item.unitPriceSnapshot,
            })),
        };
    }
}
