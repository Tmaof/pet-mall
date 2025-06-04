/**
 * 库存状态枚举
 */
export enum StockStatus {
    NORMAL = 'normal',      // 正常库存
    LOW = 'low',           // 库存不足
    EXCESS = 'excess',     // 库存积压
}