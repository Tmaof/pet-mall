export * from 'server-types';

// /**
//  * 核心指标数据
//  */
// export interface CoreMetricsDto {
//     /** 总销售额 */
//     totalSales: number;
//     /** 已支付订单 */
//     totalOrders: number;
//     /** 客单价 */
//     averageOrderValue: number;
//     /** 未支付订单总量 */
//     unpaidOrders: number;
// }

// /**
//  * 销售趋势数据点
//  */
// export interface SalesTrendDataPointDto {
//     /** 日期 */
//     date: string;
//     /** 销售额 */
//     sales: number;
//     /** 订单量 */
//     orderCount: number;
// }

// /**
//  * 订单状态分布
//  */
// export interface OrderStatusDistributionDto {
//     /** 订单状态 */
//     status: string;
//     /** 订单数量 */
//     count: number;
//     /** 占比 */
//     percentage: number;
// }

// /**
//  * 支付方式分布
//  */
// export interface PaymentMethodDistributionDto {
//     /** 支付方式 */
//     method: string;
//     /** 订单数量 */
//     count: number;
//     /** 占比 */
//     percentage: number;
// }

// /**
//  * 商品类别销售分布
//  */
// export interface CategorySalesDistributionDto {
//     /** 类别ID */
//     id: number;
//     /** 类别名称 */
//     name: string;
//     /** 销售额 */
//     sales: number;
//     /** 占比 */
//     percentage: number;
// }

// /**
//  * 地域销售分布
//  */
// export interface RegionSalesDistributionDto {
//     /** 省份代码 */
//     provinceCode: string;
//     /** 省份名称 */
//     provinceName: string;
//     /** 销售额 */
//     sales: number;
//     /** 占比 */
//     percentage: number;
// }

// /**
//  * 销售分析响应数据
//  */
// export interface SalesAnalysisResDto {
//     /** 核心指标 */
//     coreMetrics: CoreMetricsDto;
//     /** 销售趋势 */
//     salesTrend: SalesTrendDataPointDto[];
//     /** 订单状态分布 */
//     orderStatusDistribution: OrderStatusDistributionDto[];
//     /** 支付方式分布 */
//     paymentMethodDistribution: PaymentMethodDistributionDto[];
//     /** 商品类别销售分布 */
//     categorySalesDistribution: CategorySalesDistributionDto[];
//     /** 地域销售分布 */
//     regionSalesDistribution: RegionSalesDistributionDto[];
// }
