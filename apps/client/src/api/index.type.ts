export type { ProductDto } from 'server-mdl/product/product/res-dto/product.dto';

/**
 * 公共响应类型
 * @template T
 */
export type ResType<T> = {
  code: number;
  message: string;
  data: T;
  success: boolean;
};

/** 商品售卖状态 */
export const SALE_STATUS = {
  stop: 0,
  sale: 1,
} as const;
