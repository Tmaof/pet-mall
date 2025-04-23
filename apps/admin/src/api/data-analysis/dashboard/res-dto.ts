export type * from 'server-mdl/data-analysis/dashboard/res-dto'

// /**
//  * 顶部数据卡片响应DTO
//  */
// export interface TopStatsDto {
//     /** 今日销售总额 */
//     totalSales: number;
//     /** 销售总额环比变化率 */
//     salesGrowthRate: number;
//     /** 今日待处理订单数 */
//     pendingOrders: number;
//     /** 待处理订单环比变化率 */
//     pendingOrdersGrowthRate: number;
//     /** 今日新增用户数 */
//     newUsers: number;
//     /** 新增用户环比变化率 */
//     newUsersGrowthRate: number;
// }

// /**
//  * 实时交易数据点DTO
//  */
// export interface TransactionDataPointDto {
//     /** 时间点 */
//     time: string;
//     /** 交易金额 */
//     amount: number;
//     /** 订单数量 */
//     orderCount: number;
// }

// /**
//  * 热销商品DTO
//  */
// export interface HotProductDto {
//     /** 商品ID */
//     id: number;
//     /** 商品名称 */
//     name: string;
//     /** 销量 */
//     sales: number;
// }

// /**
//  * 库存预警商品DTO
//  */
// export interface StockWarningProductDto {
//     /** 商品ID */
//     id: number;
//     /** 商品名称 */
//     name: string;
//     /** 当前库存 */
//     stock: number;
//     /** 库存状态 */
//     status: string;
// }

// /**
//  * 销售类别分布DTO
//  */
// export interface SalesCategoryDto {
//     /** 类别ID */
//     id: number;
//     /** 类别名称 */
//     name: string;
//     /** 销售额 */
//     amount: number;
//     /** 占比 */
//     percentage: number;
// }

// /**
//  * 仪表盘数据响应DTO
//  */
// export interface DashboardDataDto {
//     /** 顶部数据卡片 */
//     topStats: TopStatsDto;
//     /** 实时交易趋势数据 */
//     transactionTrend: TransactionDataPointDto[];
//     /** 热销商品TOP 5 */
//     hotProducts: HotProductDto[];
//     /** 库存预警商品 */
//     stockWarnings: StockWarningProductDto[];
//     /** 销售类别分布 */
//     salesCategories: SalesCategoryDto[];
// }
