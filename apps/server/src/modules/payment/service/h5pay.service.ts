/**
 * 「H5支付」 再小的个体，也有自己的舞台
 * https://h5zhifu.com/
 */
import { serverConfig } from '@/config';
import { ConfigEnum } from '@/config/env/config.enum';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { createHash } from 'crypto';
import { NotifyData } from '../req-dto';
import { H5payResDto } from '../res-dto';


/** 支付配置 */
export const PAYMENT_CONFIG = {
    /** 应用ID */
    APP_ID: serverConfig[ConfigEnum.H5PAY_APP_ID],
    /** 密钥 */
    KEY: serverConfig[ConfigEnum.H5PAY_APP_KEY],
    /** 支付接口地址 */
    API_URL: serverConfig[ConfigEnum.H5PAY_API_URL],
    /** 支付回调地址 */
    NOTIFY_URL: serverConfig[ConfigEnum.H5PAY_NOTIFY_URL],
    /** 订单过期时间(分钟) */
    EXPIRE_TIME: Number(serverConfig[ConfigEnum.H5PAY_EXPIRE_TIME]),
};

@Injectable()
export class H5payService {
    /** 生成签名 https://h5zhifu.com/doc/api/sign.html */
    private generateSign (params: Record<string, any>): string {
        // 1. 过滤空值并排序
        const sortedParams = Object.keys(params)
            .filter(key => key !== 'sign' && params[key] !== undefined && params[key] !== '')
            .sort()
            .map(key => {
                if (/^http(s)?:\/\//.test(params[key])) {
                    return `${key}=${encodeURI(params[key])}`;
                }
                return `${key}=${params[key]}`;
            })
            .join('&');

        // 2. 拼接key
        const signStr = `${sortedParams}&key=${PAYMENT_CONFIG.KEY}`;

        // 3. MD5加密并转大写
        return createHash('md5').update(signStr)
            .digest('hex')
            .toUpperCase();
    }

    /** 创建扫码支付 */
    async createPayment (params: {
        outTradeNo: string;
        description: string;
        payType: string;
        amount: number;
        attach?: string;
    }) : Promise<H5payResDto> {
        const requestData = {
            app_id: PAYMENT_CONFIG.APP_ID,
            out_trade_no: params.outTradeNo,
            description: params.description,
            pay_type: params.payType,
            amount: params.amount,
            attach: params.attach,
            notify_url: PAYMENT_CONFIG.NOTIFY_URL,
        };


        const arg = {
            ...requestData,
            sign: this.generateSign(requestData), // 1. 生成签名
        };

        // 2. 调用支付接口
        const { data } = await axios.post(`${PAYMENT_CONFIG.API_URL}/native`, arg);

        if (data.code !== 200) {
            throw new Error(data.msg);
        }

        return data.data;
    }

    /**
     * 查询支付状态
     * 严禁使用此接口做订单状态的循环查询，否则将自动导致IP进入黑名单！
     * 此接口几乎用不到，为减轻系统负担，每天限制查询100次，仅供测试使用，若需要更高查询量
    */
    async queryPayment (params: { tradeNo?: string, outTradeNo?: string }) {
        const requestData = {
            app_id: PAYMENT_CONFIG.APP_ID,
            trade_no: params.tradeNo,
            out_trade_no: params.outTradeNo,
        };

        // 1. 生成签名
        const arg = {
            ...requestData,
            sign: this.generateSign(requestData),
        };

        // 2. 调用查询接口
        const { data } = await axios.post(`${PAYMENT_CONFIG.API_URL}/query`, arg);

        if (data.code !== 200) {
            throw new Error(data.msg);
        }

        return data.data;
    }

    /** 校验支付回调 https://h5zhifu.com/doc/api/notify.html */
    async VerifyPaymentNotify (notifyData: NotifyData): Promise<{
        success: boolean;
        resData: 'fail' | 'success';
    }> {
        // 1. 验证签名
        const { sign, ...rest } = notifyData;

        const generatedSign = this.generateSign(rest);
        if (sign !== generatedSign) {
            return { success: false, resData: 'fail' };
        }
        // 当你的服务器收到本平台的回调请求后，只要返回"success"小写单词字符串（不包括引号），那么本平台会认为通知成功，否则还会最多通知 6 次
        return { success: true, resData: 'success' };
    }
}
