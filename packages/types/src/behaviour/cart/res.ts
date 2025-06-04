import { ProductBriefDto } from '~/product/product';

/**
 * 购物车项响应 DTO
 */
export class CartItemDto {
    id: number;

    product: ProductBriefDto;

    count: number;

    createdAt: Date;
}

/**
 * 购物车列表响应 DTO
 */
export class CartListDto {
    items: CartItemDto[];

    total: number;
}