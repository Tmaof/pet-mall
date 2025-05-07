// TODO:
// export type { CartListDto, CartItemDto } from 'server-mdl/behaviour/cart/res-dto';
import { SALE_STATUS } from '@/api/index.type';

/** 商品简单的信息 响应DTO */
export class ProductBriefDto {
  /** 商品ID */
  id: number;

  /** 商品标题 */
  title: string;

  /** 分类ID */
  categoryId: number;

  /** 主图URL */
  mainImage: string;

  /** 价格 */
  price: number;

  /** 库存 */
  stock: number;

  /** 商品状态 */
  isOnSale: typeof SALE_STATUS;

  /** 创建时间 */
  createdAt: Date;

  /** 最后更新时间 */
  updatedAt: Date;

  /** 标签列表 */
  tags: any[];
}

/**
 * 购物车项响应 DTO
 */
export class CartItemDto {
  id: number;

  product: ProductBriefDto;

  count: number;

  createdAt: Date;
}

/**
 * 购物车列表响应 DTO
 */
export class CartListDto {
  items: CartItemDto[];

  total: number;
}
