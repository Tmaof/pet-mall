import { Allow, IsEnum, IsNumber } from 'class-validator';
import { PaymentMethod } from '~/enum';

export class CreatePaymentDto {
    @IsNumber()
        orderId: number;

    @IsEnum(PaymentMethod)
        payMethod: PaymentMethod;
}

/** h5pay 支付通知回调 参数 */
export class NotifyData {
    /** 应用ID。在后台系统设置页面查看 */
    @Allow()
        app_id: number;
    /** 本平台唯一订单编号 */
    @Allow()
        trade_no: string;
    /** 微信和支付宝官方的订单编号 */
    @Allow()
        in_trade_no: string;
    /** 你调用接口时填入的商家订单编号 */
    @Allow()
        out_trade_no: string;
    @Allow()
    /** 交易类型，枚举值： native/jsapi/miniapp/h5/app */
        trade_type: string;
    @Allow()

    @Allow()
        description: string;

    @Allow()
        notify_count: number;
    @Allow()
        sign: string;
}
