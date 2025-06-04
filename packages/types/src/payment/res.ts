import { PaymentMethod, PaymentStatus } from '~/enum';

export class PaymentDto {
    id: number;
    orderId: number;
    amount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    codeUrl: string;
    createdAt: Date;
    transactionId: string;
}

// 扫码支付接口返回数据
export class H5payResDto {
    /** 支付二维码内容链接，开发者在前端页面可以用jquery的qrcode插件将此链接字符串渲染出二维码图片。 */
    code_url: string;
    trade_no: string;
    /** 订单过期具体时间，目前暂时指定为2小时 */
    expire_time: string;
}
