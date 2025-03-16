import { BadRequestException } from '@nestjs/common';
import { OrderStatus } from '../enum';

/**
 * 验证订单状态变更的合法性【管理员】
 */
export function validateStatusChangeByAdmin (currentStatus: OrderStatus, newStatus: OrderStatus): void {
    // 状态流转验证规则
    const validTransitions = {
        // 初始态：待付款
        [OrderStatus.PENDING_PAYMENT]: [
            OrderStatus.PENDING_SHIPMENT, // 待发货
            OrderStatus.CANCELED_BY_CLIENT, // 已取消(买家)
            OrderStatus.CANCELED_BY_ADMIN, // 已取消(卖家)
            OrderStatus.FAILED_NO_STOCK, // 失败(库存不足)
        ],
        // 待发货
        [OrderStatus.PENDING_SHIPMENT]: [
            OrderStatus.SHIPPED, // 已发货
            OrderStatus.CANCELED_BY_ADMIN, // 已取消(卖家)
        ],
        // 已发货
        [OrderStatus.SHIPPED]: [
            OrderStatus.COMPLETED, // 已完成
        ],
        // 终态：已完成、已取消、失败
        [OrderStatus.COMPLETED]: [],
        [OrderStatus.CANCELED_BY_CLIENT]: [],
        [OrderStatus.CANCELED_BY_ADMIN]: [],
        [OrderStatus.FAILED_NO_STOCK]: [],
        [OrderStatus.CLOSED_NO_PAY]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
        throw new BadRequestException(`订单状态不能从 ${currentStatus} 变更为 ${newStatus}`);
    }
}

/**
 * 验证订单状态变更的合法性【客户】
 */
export function validateStatusChangeByClient (currentStatus: OrderStatus, newStatus: OrderStatus): void {
    // 状态流转验证规则
    const validTransitions = {
        // 初始态：待付款
        [OrderStatus.PENDING_PAYMENT]: [
            OrderStatus.CANCELED_BY_CLIENT, // 已取消(买家)
        ],
        // 待发货
        [OrderStatus.PENDING_SHIPMENT]: [

        ],
        // 已发货
        [OrderStatus.SHIPPED]: [
            OrderStatus.COMPLETED, // 已完成
        ],
        // 终态：已完成、已取消、失败
        [OrderStatus.COMPLETED]: [],
        [OrderStatus.CANCELED_BY_CLIENT]: [],
        [OrderStatus.CANCELED_BY_ADMIN]: [],
        [OrderStatus.FAILED_NO_STOCK]: [],
        [OrderStatus.CLOSED_NO_PAY]: [],
    };

    if (!validTransitions[currentStatus].includes(newStatus)) {
        throw new BadRequestException(`订单状态不能从 ${currentStatus} 变更为 ${newStatus}`);
    }
}
