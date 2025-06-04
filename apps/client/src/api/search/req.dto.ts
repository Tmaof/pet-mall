export type { SearchProductDto as SearchProductReqDto } from 'server-types';
// import { SearchResultType } from 'server-types/enum';

/** 搜索类型 */
export enum SearchType {
  /** 全部 */
  ALL = 'all',
  /** 商品 */
  PRODUCT = 'product',
  /** 分类 */
  CATEGORY = 'category',
  /** 标签 */
  TAG = 'tag',
}
