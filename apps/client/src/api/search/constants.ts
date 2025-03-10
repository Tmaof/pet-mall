import { SearchType } from './req.dto';

/** 搜索类型配置 */
export const SEARCH_TYPE_CONFIG = {
  [SearchType.ALL]: {
    label: '全部',
    value: SearchType.ALL,
  },
  [SearchType.PRODUCT]: {
    label: '商品',
    value: SearchType.PRODUCT,
  },
  [SearchType.CATEGORY]: {
    label: '分类',
    value: SearchType.CATEGORY,
  },
  [SearchType.TAG]: {
    label: '标签',
    value: SearchType.TAG,
  },
} as const;
