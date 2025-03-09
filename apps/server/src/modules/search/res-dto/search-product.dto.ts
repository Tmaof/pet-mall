import { ProductDto } from '@/modules/product/product/res-dto/product.dto';

/** 搜索商品响应DTO */
export interface SearchProductResDto {
    /** 商品列表 */
    list: ProductDto[];
    /** 总数 */
    total: number;
    /** 当前页 */
    page: number;
    /** 每页条数 */
    pageSize: number;
}
