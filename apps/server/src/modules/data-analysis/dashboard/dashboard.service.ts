import { Client } from '@/modules/client/client/client.entity';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Order } from '@/modules/order/entity/order.entity';
import { OrderStatus } from '@/modules/order/enum';
import { Product } from '@/modules/product/product/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { StockStatus } from './enum';
import {
    DashboardDataDto,
    HotProductDto,
    SalesCategoryDto,
    StockWarningProductDto,
    TopStatsDto, TransactionDataPointDto
} from './res-dto';

@Injectable()
export class DashboardService {
    constructor (
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Client)
        private readonly clientRepository: Repository<Client>,
    ) {}

    /**
     * 获取仪表盘数据
     * @param dto 请求参数
     */
    async getDashboardData (): Promise<DashboardDataDto> {
        const [topStats, transactionTrend, hotProducts, stockWarnings, salesCategories] = await Promise.all([
            this.getTopStats(),
            this.getTransactionTrend(),
            this.getHotProducts(),
            this.getStockWarnings(),
            this.getSalesCategories(),
        ]);

        return {
            topStats,
            transactionTrend,
            hotProducts,
            stockWarnings,
            salesCategories,
        };
    }

    /**
     * 获取顶部统计数据
     */
    private async getTopStats (): Promise<TopStatsDto> {
        // 获取今日和昨日的开始时间
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        // 获取今日销售数据
        const todaySales = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.createdAt >= :today AND order.paymentNo IS NOT NULL', { today })
            .getRawOne();

        // 获取昨日销售数据
        const yesterdaySales = await this.orderRepository
            .createQueryBuilder('order')
            .select('SUM(order.totalAmount)', 'total')
            .where('order.createdAt >= :yesterday AND order.createdAt < :today AND order.paymentNo IS NOT NULL', { yesterday, today })
            .getRawOne();

        // 计算销售增长率
        const salesGrowthRate = yesterdaySales.total
            ? ((todaySales.total - yesterdaySales.total) / yesterdaySales.total) * 100 : 0;

        // 获取今天待处理订单数
        const todayPendingOrders = await this.orderRepository.count({
            where: {
                status: OrderStatus.PENDING_SHIPMENT,
                createdAt: MoreThanOrEqual(yesterday),
            },
        });

        // 获取昨日待处理订单数
        const yesterdayPendingOrders = await this.orderRepository.count({
            where: {
                status: OrderStatus.PENDING_PAYMENT,
                createdAt: Between(yesterday, today),
            },
        });

        // TODO: 此处的计算方式有问题，需要重新计算
        // 计算待处理订单增长率
        const pendingOrdersGrowthRate = yesterdayPendingOrders
            ? ((todayPendingOrders - yesterdayPendingOrders) / yesterdayPendingOrders) * 100 : 0;

        // 待处理订单
        const pendingOrders = await this.orderRepository.count({ where: { status: OrderStatus.PENDING_SHIPMENT } });

        /** 今日订单数 */
        const todayOrders = await this.orderRepository.count({ where: { createdAt: MoreThanOrEqual(today) } });

        /** 昨日订单数 */
        const yesterdayOrders = await this.orderRepository.count({ where: { createdAt: Between(yesterday, today) } });

        /** 订单增长率 */
        const orderGrowthRate = yesterdayOrders
            ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 : 0;

        // 获取今日新增用户数
        const newUsers = await this.clientRepository.count({ where: { openTime: MoreThanOrEqual(today) } });

        // 获取昨日新增用户数
        const yesterdayNewUsers = await this.clientRepository.count({ where: { openTime: Between(yesterday, today) } });

        // 计算新增用户增长率
        const newUsersGrowthRate = yesterdayNewUsers
            ? ((newUsers - yesterdayNewUsers) / yesterdayNewUsers) * 100 : 0;

        return {
            totalSales: todaySales.total || 0,
            salesGrowthRate,
            pendingOrders,
            pendingOrdersGrowthRate,
            newUsers,
            newUsersGrowthRate,
            todayOrders,
            orderGrowthRate,
        };
    }

    /**
     * 获取实时交易趋势数据
     */
    private async getTransactionTrend (): Promise<TransactionDataPointDto[]> {
        // 获取最近24小时的数据
        const data = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'DATE_FORMAT(order.createdAt, "%H:00") as time',
                'SUM(order.totalAmount) as amount',
                'COUNT(order.id) as orderCount',
            ])
            .where('order.createdAt >= :startTime AND order.paymentNo IS NOT NULL', { startTime: new Date(new Date().getTime() - (24 * 60 * 60 * 1000)) })
            .groupBy('time')
            .orderBy('time', 'ASC')
            .getRawMany();

        return data.map(item => ({
            time: item.time,
            amount: Number(item.amount) || 0,
            orderCount: Number(item.orderCount) || 0,
        }));
    }

    /**
     * 获取热销商品TOP 5 【最近一个月】
     */
    private async getHotProducts (): Promise<HotProductDto[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() - 30);

        const hotProducts = await this.orderItemRepository
            .createQueryBuilder('orderItem')
            .select([
                'product.id as id',
                'product.title as name',
                'SUM(orderItem.quantity) as sales',
            ])
            .leftJoin('orderItem.product', 'product')
            .leftJoin('orderItem.order', 'order')
            .where('order.createdAt >= :today', { today })
            // .where('order.createdAt >= :today AND order.paymentNo IS NOT NULL', { today })
            .groupBy('product.id')
            .orderBy('sales', 'DESC')
            .limit(5)
            .getRawMany();

        return hotProducts.map(item => ({
            id: item.id,
            name: item.name,
            sales: Number(item.sales) || 0,
        }));
    }

    /**
     * 获取库存预警商品
     */
    private async getStockWarnings (): Promise<StockWarningProductDto[]> {
        // 获取库存不足的商品
        const lowStockProducts = await this.productRepository
            .createQueryBuilder('product')
            .where('product.stock <= 5')
            .getMany();

        // 获取库存积压的商品
        const excessStockProducts = await this.productRepository
            .createQueryBuilder('product')
            .where('product.stock >= 200')
            .getMany();

        return [
            ...lowStockProducts.map(product => ({
                id: product.id,
                name: product.title,
                stock: product.stock,
                status: StockStatus.LOW,
            })),
            ...excessStockProducts.map(product => ({
                id: product.id,
                name: product.title,
                stock: product.stock,
                status: StockStatus.EXCESS,
            })),
        ];
    }

    /**
     * 获取销售类别分布【最近一个月】
     */
    private async getSalesCategories (): Promise<SalesCategoryDto[]> {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        today.setDate(today.getDate() - 30);

        const salesByCategory = await this.orderItemRepository
            .createQueryBuilder('orderItem')
            .select([
                'category.id as id',
                'category.name as name',
                'SUM(orderItem.quantity * orderItem.unitPriceSnapshot) as amount',
            ])
            .leftJoin('orderItem.product', 'product')
            .leftJoin('product.category', 'category')
            .leftJoin('orderItem.order', 'order')
            .where('order.createdAt >= :today', { today })
            // .where('order.createdAt >= :today AND order.paymentNo IS NOT NULL', { today })
            .groupBy('category.id')
            .orderBy('amount', 'DESC')
            .getRawMany();

        const totalAmount = salesByCategory.reduce((sum, item) => sum + Number(item.amount), 0);

        return salesByCategory.map(item => ({
            id: item.id,
            name: item.name,
            amount: Number(item.amount) || 0,
            percentage: totalAmount ? (Number(item.amount) / totalAmount) * 100 : 0,
        }));
    }
}
