import i18n from '@/i18n'
import { Ref } from 'vue'

/**
 * 订单状态。
 * 主流程： 待付款 -【买家支付】 -> 待发货 - 【卖家发货】 -> 已发货 -【买家收货】 -> 已完成
 * 终态： 已取消(买家)、已取消(卖家)、失败(库存不足)、已关闭(超时未支付)
 */
export enum OrderStatus {
    /** 待付款 */
    PENDING_PAYMENT = 1,
    /** 待发货 */
    PENDING_SHIPMENT = 3,
    /** 已发货 */
    SHIPPED = 4,
    /** 已完成 */
    COMPLETED = 5,
    /** 已取消(买家) */
    CANCELED_BY_CLIENT = 6,
    /** 已取消(卖家) */
    CANCELED_BY_ADMIN = 7,
    /** 失败(库存不足) */
    FAILED_NO_STOCK = 8,
    /** 已关闭(超时未支付) */
    CLOSED_NO_PAY = 9,
}

/** 发货方式 */
export enum ShippingMethod {
    /** 快递 */
    EXPRESS = 'express',
    /** 自提 */
    SELF_PICKUP = 'self_pickup',
    /** 卡券 */
    COUPON = 'coupon',
}

/** 配送方式映射 */
export const shippingMethodMap: Record<ShippingMethod, Ref<string>> = {
  [ShippingMethod.EXPRESS]: i18n.$t('list.enum.620170-0'),
  [ShippingMethod.SELF_PICKUP]: i18n.$t('list.enum.620170-1'),
  [ShippingMethod.COUPON]: i18n.$t('list.enum.620170-2')
}

/** 支付方式 */
export enum PaymentMethod {
    /** 微信支付 */
    WECHAT = 1,
    /** 支付宝 */
    ALIPAY = 2,
}

/** 支付方式映射 */
export const paymentMethodMap: Record<PaymentMethod, Ref<string>> = {
  [PaymentMethod.WECHAT]: i18n.$t('list.enum.620170-3'),
  [PaymentMethod.ALIPAY]: i18n.$t('list.enum.620170-4')
}
