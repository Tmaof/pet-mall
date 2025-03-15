/** 支付方式 */
export enum PaymentMethod {
  /** 微信支付 */
  WECHAT = 1,
  /** 支付宝 */
  ALIPAY = 2,
}

/** 支付状态 */
export enum PaymentStatus {
  /** 待支付 */
  PENDING = 1,
  /** 支付成功 */
  SUCCESS = 2,
  /** 支付失败 */
  FAILED = 3,
  /** 已关闭 */
  CLOSED = 4,
  /** 已关闭(超时未支付) */
  CLOSED_NO_PAY = 5,
}
