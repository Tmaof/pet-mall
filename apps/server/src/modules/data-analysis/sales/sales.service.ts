import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Order } from '@/modules/order/entity/order.entity';
import { ORDER_STATUS_MAP, OrderStatus } from '@/modules/order/enum';
import { PAYMENT_LABEL_MAP } from '@/modules/payment/enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SalesAnalysisReqDto } from './req-dto';
import { SalesAnalysisResDto } from './res-dto';

@Injectable()
export class SalesService {
    constructor (
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    /**
     * 获取销售分析数据
     */
    async getSalesAnalysis (dto: SalesAnalysisReqDto): Promise<SalesAnalysisResDto> {
        // 设置默认时间范围（近7天）
        const endTime = dto.endTime || new Date();
        const startTime = dto.startTime || new Date(endTime.getTime() - (7 * 24 * 60 * 60 * 1000));

        // 并行获取所有数据
        const [
            coreMetrics,
            salesTrend,
            orderStatusDistribution,
            paymentMethodDistribution,
            categorySalesDistribution,
            regionSalesDistribution,
        ] = await Promise.all([
            this.getCoreMetrics(startTime, endTime),
            this.getSalesTrend(startTime, endTime),
            this.getOrderStatusDistribution(startTime, endTime),
            this.getPaymentMethodDistribution(startTime, endTime),
            this.getCategorySalesDistribution(startTime, endTime),
            this.getRegionSalesDistribution(startTime, endTime),
        ]);

        return {
            coreMetrics,
            salesTrend,
            orderStatusDistribution,
            paymentMethodDistribution,
            categorySalesDistribution,
            regionSalesDistribution,
        };
    }

    /**
     * 获取核心指标
     */
    private async getCoreMetrics (startTime: Date, endTime: Date) {
        // 获取总销售额和订单总量
        const salesData = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'SUM(order.totalAmount) as totalSales',
                'COUNT(order.id) as totalOrders',
            ])
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            .andWhere('order.paymentNo IS NOT NULL')
            .getRawOne();

        // 获取未支付订单数量
        const unpaidOrders = await this.orderRepository.count({
            where: {
                createdAt: Between(startTime, endTime),
                status: OrderStatus.PENDING_PAYMENT,
            },
        });

        const totalSales = Number(salesData.totalSales) || 0;
        const totalOrders = Number(salesData.totalOrders) || 0;

        return {
            totalSales,
            totalOrders,
            averageOrderValue: totalOrders ? totalSales / totalOrders : 0,
            unpaidOrders,
        };
    }

    /**
     * 获取销售趋势
     */
    private async getSalesTrend (startTime: Date, endTime: Date) {
        const data = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'DATE_FORMAT(order.createdAt, "%Y-%m-%d") as date',
                'SUM(order.totalAmount) as sales',
                'COUNT(order.id) as orderCount',
            ])
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            .andWhere('order.paymentNo IS NOT NULL')
            .groupBy('date')
            .orderBy('date', 'ASC')
            .getRawMany();

        return data.map(item => ({
            date: item.date,
            sales: Number(item.sales) || 0,
            orderCount: Number(item.orderCount) || 0,
        }));
    }

    /**
     * 获取订单状态分布
     */
    private async getOrderStatusDistribution (startTime: Date, endTime: Date) {
        const data = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'order.status as status',
                'COUNT(order.id) as count',
            ])
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            .groupBy('order.status')
            .getRawMany();

        const total = data.reduce((sum, item) => sum + Number(item.count), 0);

        return data.map(item => ({
            status: ORDER_STATUS_MAP[item.status] || item.status,
            count: Number(item.count),
            percentage: total ? (Number(item.count) / total) * 100 : 0,
        }));
    }

    /**
     * 获取支付方式分布
     */
    private async getPaymentMethodDistribution (startTime: Date, endTime: Date) {
        const data = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'order.paymentMethod as paymentMethod',
                'COUNT(order.id) as count',
            ])
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            .andWhere('order.paymentNo IS NOT NULL')
            .groupBy('order.paymentMethod')
            .getRawMany();

        const total = data.reduce((sum, item) => sum + Number(item.count), 0);

        return data.map(item => ({
            method: PAYMENT_LABEL_MAP[item.paymentMethod] || item.paymentMethod,
            count: Number(item.count),
            percentage: total ? (Number(item.count) / total) * 100 : 0,
        }));
    }

    /**
     * 获取商品类别销售分布
     */
    private async getCategorySalesDistribution (startTime: Date, endTime: Date) {
        const data = await this.orderItemRepository
            .createQueryBuilder('orderItem')
            .select([
                'category.id as id',
                'category.name as name',
                'SUM(orderItem.quantity * orderItem.unitPriceSnapshot) as sales',
            ])
            .leftJoin('orderItem.product', 'product')
            .leftJoin('product.category', 'category')
            .leftJoin('orderItem.order', 'order')
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            // .andWhere('order.paymentNo IS NOT NULL')
            .groupBy('category.id')
            .getRawMany();

        const total = data.reduce((sum, item) => sum + Number(item.sales), 0);

        return data.map(item => ({
            id: item.id,
            name: item.name,
            sales: Number(item.sales) || 0,
            percentage: total ? (Number(item.sales) / total) * 100 : 0,
        }));
    }

    /**
     * 获取地域销售分布
     */
    private async getRegionSalesDistribution (startTime: Date, endTime: Date) {
        const data = await this.orderRepository
            .createQueryBuilder('order')
            .select([
                'JSON_UNQUOTE(JSON_EXTRACT(order.addressSnapshot, "$.provinceCode")) as provinceCode',
                'JSON_UNQUOTE(JSON_EXTRACT(order.addressSnapshot, "$.province")) as provinceName',
                'SUM(order.totalAmount) as sales',
            ])
            .where('order.createdAt BETWEEN :startTime AND :endTime', { startTime, endTime })
            // .andWhere('order.paymentNo IS NOT NULL')
            // 当我们尝试按省份代码分组时，MySQL 的 ONLY_FULL_GROUP_BY 模式要求所有非聚合列都必须包含在 GROUP BY 子句中。
            .groupBy('provinceCode, provinceName')
            .getRawMany();

        const total = data.reduce((sum, item) => sum + Number(item.sales), 0);

        return data.map(item => ({
            provinceCode: item.provinceCode,
            provinceName: item.provinceName,
            sales: Number(item.sales) || 0,
            percentage: total ? (Number(item.sales) / total) * 100 : 0,
        }));
    }
}
