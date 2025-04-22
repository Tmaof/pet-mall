import { SALE_STATUS } from '@/modules/product/product/enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Cart } from '../behaviour/cart/cart.entity';
import { Product } from '../product/product/product.entity';
import { toProductBriefDto } from '../product/product/utils';
import { HOME_MODULE_CONFIG, HomeModuleType } from './constants';
import { HomeModuleItem, HomePageResDto } from './res-dto';

@Injectable()
export class HomePageService {
    constructor (
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Cart)
        private cartRepository: Repository<Cart>,
    ) {}

    /**
     * 获取首页数据
     */
    async getHomePageData (): Promise<HomePageResDto> {
        // 1. 获取模块数据
        const newProductsModule = await this.getNewProductsModule();
        const mostFavoriteModule = await this.getMostFavoriteModule();

        // 2. 合并所有模块并按优先级排序
        const modules = [newProductsModule, mostFavoriteModule]
            .filter(Boolean)
            .sort((aItem, bItem) => {
                const priorityA = HomeModuleType[aItem.type].priority;
                const priorityB = HomeModuleType[bItem.type].priority;
                return priorityB - priorityA;
            });

        return { modules };
    }

    /**
     * 获取新品推荐模块
     */
    private async getNewProductsModule (): Promise<HomeModuleItem> {
        // 计算最近7天的日期
        const nowDate = new Date();
        const recentDate = new Date(nowDate.getTime() - (HOME_MODULE_CONFIG.NEW_PRODUCTS_DAYS * 24 * 60 * 60 * 1000));

        // 查询最新商品
        let products = await this.productRepository.find({
            where: {
                createdAt: MoreThanOrEqual(recentDate),
                isOnSale: SALE_STATUS.sale,
            },
            relations: ['tags'],
            order: { createdAt: 'DESC' },
            take: HOME_MODULE_CONFIG.MAX_PRODUCTS_PER_MODULE,
        });

        // 如果没有商品则不返回此模块
        // if (!products.length) return null;
        // 如果没有商品 则返回最近的前x个商品
        if (!products.length) {
            products = await this.productRepository.find({
                order: { createdAt: 'DESC' },
                relations: ['tags'],
                take: HOME_MODULE_CONFIG.MAX_PRODUCTS_PER_MODULE,
            });
        }

        return {
            name: HomeModuleType.new.name,
            type: HomeModuleType.new.type,
            products: products.map(product => toProductBriefDto(product)),
        };
    }

    /**
     * 获取最多收藏模块。
     * 最近 10000 个收藏的记录中，收藏数量排名前 x 的商品。
     */
    private async getMostFavoriteModule (): Promise<HomeModuleItem> {
        // 获取最近10000条收藏记录
        const recentCarts = await this.cartRepository.find({
            relations: ['product'],
            order: { createdAt: 'DESC' },
            take: 10000,
        });

        // 统计每个商品的收藏数量
        const productCountMap = new Map<number, {
            count: number;
            product: Product;
        }>();
        recentCarts.forEach(cart => {
            const record = productCountMap.get(cart.product.id);
            if (record) {
                record.count += 1;
            } else {
                productCountMap.set(cart.product.id, {
                    count: 1,
                    product: cart.product,
                });
            }
        });

        // 获取收藏数量排名前x的商品
        const topProducts = Array.from(productCountMap.entries())
            .sort((first, second) => second[1].count - first[1].count)
            .slice(0, HOME_MODULE_CONFIG.MAX_PRODUCTS_PER_MODULE)
            .map(([, record]) => record.product);

        return {
            name: HomeModuleType.mostCollection.name,
            type: HomeModuleType.mostCollection.type,
            products: topProducts.map(product => toProductBriefDto(product)),
        };
    }
}
