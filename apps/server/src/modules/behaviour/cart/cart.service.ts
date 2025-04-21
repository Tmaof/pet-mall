import { Client } from '@/modules/client/client/client.entity';
import { Product } from '@/modules/product/product/product.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Cart } from './cart.entity';
import { AddToCartDto, DeleteCartItemsDto, UpdateCartItemDto } from './req-dto';
import { CartListDto } from './res-dto';
import { toCartItemDto } from './utils';

@Injectable()
export class CartService {
    constructor (
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    /**
     * 获取用户的购物车列表
     * @param client 当前用户
     * @returns 购物车列表
     */
    async getCartList (clientId: Client['id'], page: number, pageSize: number): Promise<CartListDto> {
        const [items, total] = await this.cartRepository.findAndCount({
            where: { client: { id: clientId } },
            relations: ['product'],
            order: { createdAt: 'DESC' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            items: items.map(toCartItemDto),
            total,
        };
    }

    /** 获取客户的购物车数量 */
    async getCartCount (clientId: Client['id'],) {
        const count = await this.cartRepository.count({ where: { client: { id: clientId } } });
        return count;
    }

    /**
     * 添加商品到购物车
     * @param client 当前用户
     * @param dto 添加商品请求 DTO
     * @returns 操作结果
     */
    async addToCart (clientId: Client['id'], dto: AddToCartDto) {
        const { productId, quantity } = dto;

        // 检查商品是否存在
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException('商品不存在');
        }

        // 检查购物车是否已存在该商品
        let cartItem = await this.cartRepository.findOne({
            where: {
                client: { id: clientId },
                product: { id: productId },
            },
        });

        if (cartItem) {
            // 更新数量
            const newQuantity = cartItem.count + quantity;
            cartItem.count = newQuantity;
        } else {
            // 创建新的购物车项
            cartItem = this.cartRepository.create({
                client: { id: clientId },
                product,
                count: quantity,
            });
        }

        await this.cartRepository.save(cartItem);
    }

    /**
     * 更新购物车商品数量
     * @param client 当前用户
     * @param dto 更新请求 DTO
     * @returns 操作结果
     */
    async updateCartItem (clientId: Client['id'], dto: UpdateCartItemDto) {
        const { cartItemId, quantity } = dto;

        const cartItem = await this.cartRepository.findOne({
            where: {
                id: cartItemId,
                client: { id: clientId },
            },
            relations: ['product'],
        });

        if (!cartItem) {
            throw new NotFoundException('购物车项不存在');
        }

        cartItem.count = quantity;
        await this.cartRepository.save(cartItem);
    }

    /**
     * 从购物车移除商品
     * @param client 当前用户
     * @param dto 移除请求 DTO
     * @returns 操作结果
     */
    async removeCartItem (clientId: Client['id'], cartItemId: number) {
        const res = await this.cartRepository.delete({
            id: cartItemId,
            client: { id: clientId },
        });

        if (res.affected === 0) {
            throw new NotFoundException('购物车项不存在');
        }
    }

    /**
     * 从购物车移除商品 多个
     * @param client 当前用户
     * @param dto 移除请求 DTO
     * @returns 操作结果
     */
    async removeCartItems (clientId: Client['id'], dto: DeleteCartItemsDto) {
        const { cartItemIds } = dto;
        const res = await this.cartRepository.delete({
            id: In(cartItemIds),
            client: { id: clientId },
        });

        if (res.affected === 0) {
            throw new NotFoundException('购物车项不存在');
        }
    }

    /**
     * 清空购物车
     * @param client 当前用户
     * @returns 操作结果
     */
    async clearCart (clientId: Client['id']) {
        await this.cartRepository.delete({ client: { id: clientId } });
    }
}
