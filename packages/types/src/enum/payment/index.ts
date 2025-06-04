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

/** 支付方式 */
export enum PaymentMethod {
    /** 微信支付 */
    WECHAT = 1,
    /** 支付宝 */
    ALIPAY = 2,
}

/** h5pay 支付类型映射 */
export const PAYMENT_TYPE_MAP = {
    [PaymentMethod.WECHAT]: 'wechat',
    [PaymentMethod.ALIPAY]: 'alipay',
} as const;

/**
 * 支付方式映射
 */
export const PAYMENT_LABEL_MAP = {
    [PaymentMethod.WECHAT]: '微信支付',
    [PaymentMethod.ALIPAY]: '支付宝',
};
