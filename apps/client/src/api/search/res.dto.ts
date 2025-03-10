import { ProductDto } from '@/api/index.type';

/** 搜索商品响应DTO */
export interface SearchProductResDto {
  /** 商品列表 */
  list: ProductDto[];
  /** 总数 */
  total: number;
  /** 当前页 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}
