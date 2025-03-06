
/** 商品信息响应DTO */
export class ProductDto {
    /** 商品ID */
    id: number;

    /** 商品标题 */
    title: string;

    /** 分类ID */
    categoryId: number;

    /** 分类名称 */
    categoryName: string;

    /** 主图URL */
    mainImage: string;

    /** 商品描述 */
    description: string;

    /** 价格 */
    price: number;

    /** 库存 */
    stock: number;

    /** 商品状态 */
    isOnSale: boolean;

    /** 创建时间 */
    createdAt: Date;

    /** 最后更新时间 */
    updatedAt: Date;
}

/** 商品列表响应DTO */
export class ProductListDto {
    /** 商品列表 */
    list: ProductDto[];

    /** 总数 */
    total: number;
}
