export type { AddToCartDto, DeleteCartItemsDto, UpdateCartItemDto } from 'server-types';

/**
 * 购物车分页查询参数
 */
export interface CartListQueryDto {
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}
