
export * from './src/constants'; // 常量
export * from './src/enum'; // 枚举

// 中国省市区
export * from './src/address';

// 客户行为 模块
export * from './src/behaviour/cart';
export * from './src/behaviour/favorite';
export * from './src/behaviour/review';

// 商品 模块
export * from './src/product/category';
export * from './src/product/product';
export * from './src/product/tag';

// 客户 模块
export * from './src/client/address';
export * from './src/client/auth';
export * from './src/client/client';

// 数据分析 模块
export * from './src/data-analysis/dashboard';
export * from './src/data-analysis/sales';

// 首页
export * from './src/home-page';

// jwt
export * from './src/jwt';

// 订单
export * from './src/order';

// 支付
export * from './src/payment';

// 搜索
export * from './src/search';

// 后台员工管理 模块
export * from './src/staff/auth';
export * from './src/staff/permission';
export * from './src/staff/role';
export * from './src/staff/user';
export * from './src/staff/user-log';

// 文件上传
export * from './src/upload';


/**
 * 公共响应类型
 * @template T
 */
export interface ResType<T> {
    code: number;
    message: string;
    data: T;
    success: boolean;
  }
