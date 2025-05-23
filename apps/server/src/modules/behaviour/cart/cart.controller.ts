import { ReqUser } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { Client } from '@/modules/client/client/client.entity';
import { getCommonRes } from '@/utils';
import {
    Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Put, Query, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './req-dto';
import { DeleteCartItemsDto } from './req-dto/index';


@Controller('cart')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class CartController {
    constructor (private readonly cartService: CartService) {}

    /**
     * 获取购物车列表
     */
    @Get()
    async getCartList (
    @ReqUser('clientId') clientId: Client['id'],
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 10,
    ) {
        const data = await this.cartService.getCartList(clientId, page, pageSize);
        return getCommonRes({ data });
    }

    /**
     * 获取购物车列表数量
     */
    @Get('count')
    async getCartCount (@ReqUser('clientId') clientId: Client['id'],) {
        const data = await this.cartService.getCartCount(clientId);
        return getCommonRes({ data });
    }

    /**
     * 添加商品到购物车
     */
    @Post()
    async addToCart (
    @ReqUser('clientId') clientId: Client['id'],
        @Body() dto: AddToCartDto,
    ) {
        await this.cartService.addToCart(clientId, dto);
        return getCommonRes();
    }

    /** 更新购物车商品数量 */
    @Put()
    async updateCartItem (
    @ReqUser('clientId') clientId: Client['id'],
        @Body() dto: UpdateCartItemDto,
    ) {
        await this.cartService.updateCartItem(clientId, dto);
        return getCommonRes();
    }

    /** 移除购物车商品 */
    @Delete('item/:cartItemId')
    async removeCartItem (
    @ReqUser('clientId') clientId: Client['id'],
        @Param('cartItemId') cartItemId: number,
    ) {
        await this.cartService.removeCartItem(clientId, cartItemId);
        return getCommonRes();
    }

    /** 移除购物车商品 多个 */
    @Delete('items')
    async removeCartItems (
    @ReqUser('clientId') clientId: Client['id'],
        @Body() dto: DeleteCartItemsDto,
    ) {
        await this.cartService.removeCartItems(clientId, dto);
        return getCommonRes();
    }

    /** 清空购物车 */
    @Delete('clear')
    async clearCart (@ReqUser('clientId') clientId: Client['id']) {
        await this.cartService.clearCart(clientId);
        return getCommonRes();
    }
}
