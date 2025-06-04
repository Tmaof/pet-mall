import { SearchResultType } from '~/enum';
import { ProductDto } from '~/product/product';


/** 搜索建议项 */
export interface SearchSuggestItem {
    /** 建议文本 */
    text: string;
    /** 来源类型 */
    type: SearchResultType;
    /** 相关ID */
    id: number;
    /** 权重分数 */
    weight: number;
}

/** 搜索建议响应 */
export interface SearchSuggestResDto {
    /** 建议列表 */
    suggestions: SearchSuggestItem[];
}


/** 分页通用响应 */
export interface PaginationResDto {
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页条数 */
    pageSize: number;
}

/** 搜索商品响应DTO */
export interface SearchProductResDto extends PaginationResDto {
    /** 商品列表 */
    list: ProductDto[];
}
