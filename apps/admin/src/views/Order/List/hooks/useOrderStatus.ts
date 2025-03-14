import { OrderStatus } from '@/api/order/list/enum'
import i18n from '@/i18n'
import { Ref } from 'vue'

interface OrderStatusOption {
  label: Ref<string>
  value: OrderStatus
}

/**
 * 订单状态相关的 hook
 */
export function useOrderStatus() {
  /** 订单状态选项 */
  const orderStatusOptions: OrderStatusOption[] = [
    { label: i18n.$t('hooks.useOrderStatus.032603-0'), value: OrderStatus.PENDING_PAYMENT },
    { label: i18n.$t('hooks.useOrderStatus.032603-1'), value: OrderStatus.PENDING_SHIPMENT },
    { label: i18n.$t('hooks.useOrderStatus.032603-2'), value: OrderStatus.SHIPPED },
    { label: i18n.$t('hooks.useOrderStatus.032603-3'), value: OrderStatus.COMPLETED },
    { label: i18n.$t('hooks.useOrderStatus.032603-4'), value: OrderStatus.CANCELED_BY_CLIENT },
    { label: i18n.$t('hooks.useOrderStatus.032603-5'), value: OrderStatus.CANCELED_BY_ADMIN },
    { label: i18n.$t('hooks.useOrderStatus.032603-6'), value: OrderStatus.FAILED_NO_STOCK },
    { label: i18n.$t('hooks.useOrderStatus.032603-7'), value: OrderStatus.CLOSED_NO_PAY }
  ]

  /**
   * 获取订单状态标签
   */
  const getOrderStatusLabel = (status: OrderStatus): string => {
    return orderStatusOptions.find(item => item.value === status)?.label.value || i18n.$t('hooks.useOrderStatus.101296-11').value
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
