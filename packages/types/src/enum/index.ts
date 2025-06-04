export * from './search'
export * from './staff/permission'
export * from './product/product'
export * from './behaviour/review'
export * from './client/address'
export * from './client/client'
export * from './data-analysis/dashboard'
export * from './order'
export * from './payment'


/** 响应code */
export enum ResCodeEnum {
    /** 请求成功 */
    success = 10000,
    /** 请求失败 */
    fail = 10001,
    /** 请求参数错误 */
    reqArgError = 10002,
}
