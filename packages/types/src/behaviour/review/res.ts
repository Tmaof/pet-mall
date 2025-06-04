
/**
 * 评论基础信息DTO
 */
export class BaseReviewDto {
    /** 用户ID */
    clientId: number;

    /** 客户名 */
    clientname: string;

    /** 用户头像 */
    clientAvatar: string;

    /** 评论内容 */
    content: string;

    /** 点赞数 */
    likeCount: number;

    /** 创建时间 */
    createdAt: Date;

    /** 回复数量 */
    replyCount: number;

    /** 是否点赞 */
    liked: boolean;
}

/**
 * 商品评论DTO
 */
export class ProductReviewDto extends BaseReviewDto {
    /** 评论ID */
    productReviewId: number;

    /** 商品ID */
    productId: number;

    /** 评分 */
    rating: number;

    /** 图片URL数组 */
    images?: string[];
}

/**
 * 回复评论DTO
 */
export class ReviewReplyDto extends BaseReviewDto {
    /** 回复ID */
    replyId: number;

    /** 根评论ID */
    rootReviewId: number;

    /** 父评论ID */
    parentId?: number;

    /** 被回复的用户ID */
    replyToClientId?: number;

    /** 被回复的用户昵称 */
    replyToClientname?: string;
}

/**
 * 评论列表响应DTO
 */
export class ReviewListDto<T> {
    /** 评论列表 */
    list: T[];

    /** 总数量 */
    total: number;

    /** 当前页码 */
    page: number;

    /** 每页数量 */
    pageSize: number;
}

/**
 * 商品评论列表响应DTO
 */
export class ProductReviewListDto extends ReviewListDto<ProductReviewDto> {}

/**
 * 回复评论列表响应DTO
 */
export class ReviewReplyListDto extends ReviewListDto<ReviewReplyDto> {}

/**
 * 待评价商品DTO
 */
export class PendingReviewProductDto {
    /** 订单id */
    orderId: number;
    /** 订单项ID */
    orderItemId: number;
    /** 商品ID */
    id: number;
    /** 分类ID */
    categoryId: number;
    /** 商品标题 */
    title: string;
    mainImage: string;
    /** 购买数量 */
    quantity: number;
    price: number;
    stock: number;
    isOnSale: number;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * 待评价商品列表响应DTO
 */
export class PendingReviewProductsDto extends ReviewListDto<PendingReviewProductDto> {}


/**
 * 已评价商品DTO
 */
export class ReviewedProductDto {
    /** 订单id */
    orderId: number;
    /** 订单项ID */
    orderItemId: number;
    /** 商品ID */
    id: number;
    /** 分类ID */
    categoryId: number;
    /** 商品标题 */
    title: string;
    mainImage: string;
    /** 购买数量 */
    quantity: number;
    price: number;
    stock: number;
    isOnSale: number;
    /** 评价时间 */
    reviewTime: Date;
    /** 评分 */
    rating: number;
    /** 内容 */
    content: string;
}

/** 已评价商品列表的响应 */
export class ReviewedProductsDto extends ReviewListDto<ReviewedProductDto> {}
