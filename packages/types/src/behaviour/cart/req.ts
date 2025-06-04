import {
    IsArray,
    IsInt, IsNotEmpty, IsNumber, IsPositive,
    Min
} from 'class-validator';

/**
 * 添加商品到购物车请求 DTO
 */
export class AddToCartDto {
    @IsNotEmpty({ message: '商品ID不能为空' })
    @IsInt({ message: '商品ID必须是整数' })
    @IsPositive({ message: '商品ID必须为正数' })
        productId: number;

    @IsNotEmpty({ message: '商品数量不能为空' })
    @IsNumber({}, { message: '商品数量必须是数字' })
    @Min(1, { message: '商品数量不能小于1' })
        quantity: number;
}

/**
 * 更新购物车商品数量请求 DTO
 */
export class UpdateCartItemDto {
    @IsNotEmpty({ message: '购物车项ID不能为空' })
    @IsInt({ message: '购物车项ID必须是整数' })
    @IsPositive({ message: '购物车项ID必须为正数' })
        cartItemId: number;

    @IsNotEmpty({ message: '商品数量不能为空' })
    @IsNumber({}, { message: '商品数量必须是数字' })
    @Min(1, { message: '商品数量不能小于1' })
        quantity: number;
}

/**
 * 删除购物车项参数
 */
export class DeleteCartItemsDto {
    /** 购物车项ID列表 */
    @IsNotEmpty({ message: '购物车项ID列表不能为空' })
    @IsArray()
        cartItemIds: number[];
}
