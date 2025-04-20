import { Cart } from '../cart.entity';
import { CartItemDto } from '../res-dto';
import { toProductBriefDto } from '@/modules/product/product/utils';

/**
 * 将购物车项转换为 DTO
 * @param item 购物车项
 * @returns 购物车项 DTO
 */
export function toCartItemDto (item: Cart): CartItemDto {
    return {
        id: item.id,
        product: toProductBriefDto(item.product),
        count: item.count,
        createdAt: item.createdAt,
    };
}
