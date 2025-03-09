import { SALE_STATUS } from '@/modules/product/product/enum';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Product } from '../product/product/product.entity';
import { toProductDto } from '../product/product/utils';
import { HOME_MODULE_CONFIG, HomeModuleType } from './constants';
import { HomeModuleItem, HomePageResDto } from './res-dto';

@Injectable()
export class HomePageService {
    constructor (@InjectRepository(Product)
    private productRepository: Repository<Product>,) {}

    /**
     * 获取首页数据
     */
    async getHomePageData (): Promise<HomePageResDto> {
        // 1. 获取新品推荐模块数据
        const newProductsModule = await this.getNewProductsModule();

        // 2. 合并所有模块并按优先级排序
        const modules = [newProductsModule]
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
        const products = await this.productRepository.find({
            where: {
                createdAt: MoreThanOrEqual(recentDate),
                isOnSale: SALE_STATUS.sale,
            },
            relations: ['category', 'tags'],
            order: { createdAt: 'DESC' },
            take: HOME_MODULE_CONFIG.MAX_PRODUCTS_PER_MODULE,
        });

        // 如果没有商品则不返回此模块
        if (!products.length) return null;

        return {
            name: HomeModuleType.new.name,
            type: HomeModuleType.new.type,
            products: products.map(product => toProductDto(product)),
        };
    }
}
