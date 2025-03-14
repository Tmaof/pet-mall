import { OrderStatus } from '@/api/order/list/enum'

interface OrderStatusOption {
  label: string
  value: OrderStatus
}

/**
 * 订单状态相关的 hook
 */
export function useOrderStatus() {
  /** 订单状态选项 */
  const orderStatusOptions: OrderStatusOption[] = [
    { label: '待付款', value: OrderStatus.PENDING_PAYMENT },
    { label: '待发货', value: OrderStatus.PENDING_SHIPMENT },
    { label: '已发货', value: OrderStatus.SHIPPED },
    { label: '已完成', value: OrderStatus.COMPLETED },
    { label: '已取消(买家)', value: OrderStatus.CANCELED_BY_CLIENT },
    { label: '已取消(卖家)', value: OrderStatus.CANCELED_BY_ADMIN },
    { label: '失败(库存不足)', value: OrderStatus.FAILED_NO_STOCK },
    { label: '已关闭(超时未支付)', value: OrderStatus.CLOSED_NO_PAY }
  ]

  /**
   * 获取订单状态标签
   */
  const getOrderStatusLabel = (status: OrderStatus): string => {
    return orderStatusOptions.find(item => item.value === status)?.label || '未知状态'
  }

  /**
   * 获取订单状态标签的类型
   */
  const getOrderStatusType = (status: OrderStatus): 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case OrderStatus.COMPLETED:
        return 'success'
      case OrderStatus.PENDING_PAYMENT:
      case OrderStatus.PENDING_SHIPMENT:
        return 'warning'
      case OrderStatus.SHIPPED:
        return 'info'
      case OrderStatus.CANCELED_BY_CLIENT:
      case OrderStatus.CANCELED_BY_ADMIN:
      case OrderStatus.FAILED_NO_STOCK:
      case OrderStatus.CLOSED_NO_PAY:
        return 'danger'
      default:
        return 'info'
    }
  }

  return {
    orderStatusOptions,
    getOrderStatusLabel,
    getOrderStatusType
  }
}
