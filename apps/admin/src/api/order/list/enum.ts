import i18n from '@/i18n'
import { Ref } from 'vue'
import { OrderStatus, ShippingMethod, PaymentMethod } from 'server-types/enum'
export { OrderStatus, ShippingMethod, PaymentMethod }

/** 配送方式映射 */
export const shippingMethodMap: Record<ShippingMethod, Ref<string>> = {
  [ShippingMethod.EXPRESS]: i18n.$t('list.enum.620170-0'),
  [ShippingMethod.SELF_PICKUP]: i18n.$t('list.enum.620170-1'),
  [ShippingMethod.COUPON]: i18n.$t('list.enum.620170-2')
}

/** 支付方式映射 */
export const paymentMethodMap: Record<PaymentMethod, Ref<string>> = {
  [PaymentMethod.WECHAT]: i18n.$t('list.enum.620170-3'),
  [PaymentMethod.ALIPAY]: i18n.$t('list.enum.620170-4')
}
