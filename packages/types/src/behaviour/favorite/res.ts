import { ProductDto } from '~/product/product/res';


/** 收藏商品信息 */
export class FavoriteItemDto extends ProductDto {
  /** 收藏时间 */
  favoriteTime: string;
}

/** 客户收藏列表 响应dto */
export class FavoriteListResDto {
  /** 收藏列表 */
  items: FavoriteItemDto[];
  /** 总数 */
  total: number;
}
