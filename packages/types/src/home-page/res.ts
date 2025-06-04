import { HomeModuleType } from '~/constants';
import { ProductBriefDto } from '~/product/product';

/** 首页模块项 */
export interface HomeModuleItem {
    /** 模块名称 */
    name: string;
    /** 模块类型 */
    type: keyof typeof HomeModuleType;
    /** 模块商品列表 */
    products: ProductBriefDto[];
}

/** 首页数据响应DTO */
export interface HomePageResDto {
    /** 模块列表 */
    modules: HomeModuleItem[];
}
