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

/** 搜索商品请求DTO */
export interface SearchProductReqDto {
  /** 搜索关键词 */
  keyword?: string;
  /** 搜索类型 */
  type?: SearchType;
  /** 相关ID(分类ID或标签ID) */
  id?: number;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}
