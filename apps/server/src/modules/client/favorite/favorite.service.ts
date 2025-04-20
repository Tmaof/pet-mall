import { toProductDto } from '@/modules/product/product/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { FavoriteListResDto } from './res-dto';

@Injectable()
export class FavoriteService {
    constructor (@InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>,) {}

    /**
     * 新增收藏
     * @param clientId 用户ID
     * @param productId 商品ID
     */
    async addFavorite (clientId: number, productId: number) {
        const favorite = this.favoriteRepository.create({
            client: { id: clientId },
            product: { id: productId },
        });
        await this.favoriteRepository.save(favorite);
    }

    /**
     * 判断当前客户是否收藏了该商品
     * @param clientId 用户ID
     * @param productId 商品ID
     */
    async isFavored (clientId: number, productId: number) {
        const count = await this.favoriteRepository.count({ where: { client: { id: clientId }, product: { id: productId } } });
        return count > 0;
    }

    /**
     * 删除收藏
     * @param clientId 用户ID
     * @param productId 商品ID
     */
    async removeFavorite (clientId: number, productId: number) {
        await this.favoriteRepository.delete({
            client: { id: clientId },
            product: { id: productId },
        });
    }

    /**
     * 查询用户收藏列表
     * @param clientId 用户ID
     * @param page 页码
     * @param pageSize 每页数量
     */
    async getFavoriteList (clientId: number, page = 1, pageSize = 10): Promise<FavoriteListResDto> {
        const [items, total] = await this.favoriteRepository.findAndCount({
            where: { client: { id: clientId } },
            skip: (page - 1) * pageSize,
            take: pageSize,
            relations: ['product'],
        });
        return {
            items: items.map((item) => toProductDto(item.product)),
            total,
        };
    }
}

