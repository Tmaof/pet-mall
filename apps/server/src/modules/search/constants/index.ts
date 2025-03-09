/** 搜索结果的权重配置 */
export const SEARCH_WEIGHTS = {
    /** 商品标题权重 */
    PRODUCT_TITLE: 100,
    /** 商品描述权重 */
    PRODUCT_DESC: 60,
    /** 分类名称权重 */
    CATEGORY: 80,
    /** 标签名称权重 */
    TAG: 70,
} as const;

/** 搜索配置 */
export const SEARCH_CONFIG = {
    /** 最大返回结果数 */
    MAX_RESULTS: 10,
    /** 最小匹配度(0-1之间) */
    MIN_SIMILARITY: 0.3,
} as const;
