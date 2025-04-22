import { Address } from '@/modules/client/address/address.entity';
import { SALE_STATUS } from '@/modules/product/product/enum';
import { Product } from '@/modules/product/product/product.entity';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { OrderItem } from '../entity/order-item.entity';
import { Order } from '../entity/order.entity';
import { OrderStatus } from '../enum';
import { CreateOrderDto, QueryOrderDto, UpdateOrderStatusByClientDto } from '../req-dto';
import { ClientOrderDto, ClientOrderListDto } from '../res-dto';
import { validateStatusChangeByClient } from '../utils';
import { Client } from '@/modules/client/client/client.entity';
import { ClientStatus } from '@/modules/client/client/enum';

@Injectable()
export class ClientOrderService {
    constructor (
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Address)
        private addressRepository: Repository<Address>,
        private dataSource: DataSource,
        @InjectRepository(Client)
        private clientRepository: Repository<Client>,
    ) {}

    /**
     * 创建订单
     */
    async create (clientId: number, createOrderDto: CreateOrderDto): Promise<ClientOrderDto> {
        const { items, addressId, remark } = createOrderDto;

        // 判断客户是否被禁用
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (client.status === ClientStatus.DISABLE) {
            throw new BadRequestException('客户已被禁用');
        }

        // 使用事务确保数据一致性
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 验证收货地址
            const address = await this.addressRepository.findOne({ where: { id: addressId, clientId } });

            if (!address) {
                throw new BadRequestException('收货地址不存在');
            }

            // 2. 验证所有商品并计算总金额
            let totalAmount = 0;
            const productDetails = [];

            for (const item of items) {
                const product = await this.productRepository.findOne({ where: { id: item.productId } });

                if (!product) {
                    throw new BadRequestException(`商品ID ${item.productId} 不存在`);
                }

                if (product.isOnSale !== SALE_STATUS.sale) {
                    throw new BadRequestException(`商品 ${product.title} 已下架`);
                }

                if (product.stock < item.quantity) {
                    throw new BadRequestException(`商品 ${product.title} 库存不足`);
                }

                totalAmount += product.price * item.quantity;
                productDetails.push({
                    product,
                    quantity: item.quantity,
                });
            }

            // 3. 创建订单
            const order = new Order();
            order.clientId = clientId;
            order.totalAmount = totalAmount;
            order.status = OrderStatus.PENDING_PAYMENT;
            // order.addressId = addressId; // 不需要保存地址ID，保存快照即可，因为地址可能会被修改，删除
            order.addressSnapshot = { ...address }; // 保存地址快照
            order.remark = remark;

            const savedOrder = await queryRunner.manager.save(order);

            // 4. 创建订单项并扣减库存
            for (const detail of productDetails) {
                const { product, quantity } = detail;

                // 创建订单项
                const orderItem = new OrderItem();
                orderItem.orderId = savedOrder.id;
                orderItem.productId = product.id;
                orderItem.quantity = quantity;
                orderItem.titleSnapshot = product.title;
                orderItem.mainImageSnapshot = product.mainImage;
                orderItem.unitPriceSnapshot = product.price;

                await queryRunner.manager.save(orderItem);

                // 扣减库存
                product.stock -= quantity;
                await queryRunner.manager.save(product);
            }

            // 提交事务
            await queryRunner.commitTransaction();

            // 返回完整订单信息
            return this.findOne(clientId, savedOrder.id);
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
     * 查询订单列表
     */
    async findAll (clientId: number, queryOrderDto: QueryOrderDto): Promise<ClientOrderListDto> {
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
            relations: ['orderItems'],
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
    async findOne (clientId: number, id: number): Promise<ClientOrderDto> {
        const order = await this.orderRepository.findOne({
            where: { id, clientId },
            relations: ['orderItems'],
        });

        if (!order) {
            throw new NotFoundException('订单不存在');
        }

        return this.toOrderDto(order);
    }

    /**
     * 【客户】更新订单状态
     */
    async updateStatus (clientId: number, id: number, updateOrderStatusDto: UpdateOrderStatusByClientDto): Promise<ClientOrderDto> {
        const { status } = updateOrderStatusDto;

        // 使用事务进行更新
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 验证订单存在
            const order = await this.orderRepository.findOne({
                where: { id, clientId },
                relations: ['orderItems'],
            });

            if (!order) {
                throw new NotFoundException('订单不存在');
            }

            // 2. 验证状态更新的合法性
            validateStatusChangeByClient(order.status, status);


            // 如果是取消订单，需要归还库存
            if (status === OrderStatus.CANCELED_BY_CLIENT) {
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
            // 6. 保存更新
            order.status = status;
            await queryRunner.manager.save(order);

            // 提交事务
            await queryRunner.commitTransaction();

            // 返回更新后的订单
            return this.findOne(clientId, id);
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
     * 【客户】取消订单
     */
    async cancelOrder (clientId: number, id: number): Promise<ClientOrderDto> {
        return this.updateStatus(clientId, id, { status: OrderStatus.CANCELED_BY_CLIENT });
    }

    /**
     * 转换为DTO
     */
    private toOrderDto (order: Order): ClientOrderDto {
        return {
            id: order.id,
            clientId: order.clientId,
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
