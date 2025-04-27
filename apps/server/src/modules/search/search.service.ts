import { extractMatchContext } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Like, Repository } from 'typeorm';
import { Category } from '../product/category/category.entity';
import { SALE_STATUS } from '../product/product/enum';
import { Product } from '../product/product/product.entity';
import { toProductDto } from '../product/product/utils';
import { Tag } from '../product/tag/tag.entity';
import { SEARCH_CONFIG, SEARCH_PRODUCT_CONFIG, SEARCH_PRODUCT_WEIGHTS, SEARCH_WEIGHTS } from './constants';
import { SearchResultType } from './enum';
import { SearchSuggestReqDto } from './req-dto';
import { SearchSuggestItem, SearchSuggestResDto } from './res-dto';
import { SearchProductResDto } from './res-dto/search-product.dto';

/**
 * 合并商品结果并去重
 * 如果同一个商品有多个来源，取最高权重
 */
function mergeAndDedupeProducts (products: (Product & { weight: number })[]) {
    const productMap = new Map<number, Product & { weight: number }>();

    products.forEach(product => {
        const existing = productMap.get(product.id);
        if (!existing || existing.weight < product.weight) {
            productMap.set(product.id, product);
        }
    });

    return Array.from(productMap.values());
}

@Injectable()
export class SearchService {
    constructor (
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Tag)
        private tagRepository: Repository<Tag>,
    ) {}

    /**
   * 获取搜索建议
   * @param dto 搜索建议请求DTO
   * @returns 搜索建议响应DTO
   */
    async getSuggestions (dto: SearchSuggestReqDto): Promise<SearchSuggestResDto> {
        const { keyword } = dto;
        const suggestions: SearchSuggestItem[] = [];
        if (!keyword) return { suggestions: [] };

        // 1. 搜索商品
        const products = await this.productRepository.find({
            where: [
                { title: Like(`%${keyword}%`) },
                { description: Like(`%${keyword}%`) },
            ],
            take: SEARCH_CONFIG.MAX_RESULTS,
        });

        // 2. 搜索分类
        const categories = await this.categoryRepository.find({
            where: { name: Like(`%${keyword}%`) },
            take: SEARCH_CONFIG.MAX_RESULTS,
        });

        // 3. 搜索标签
        const tags = await this.tagRepository.find({
            where: { name: Like(`%${keyword}%`) },
            take: SEARCH_CONFIG.MAX_RESULTS,
        });

        // 4. 处理商品搜索结果
        products.forEach(product => {
            // 标题匹配
            if (product.title.includes(keyword)) {
                suggestions.push({
                    text: product.title,
                    type: SearchResultType.PRODUCT,
                    id: product.id,
                    weight: SEARCH_WEIGHTS.PRODUCT_TITLE,
                });
            }
            // 描述匹配
            if (product.description?.includes(keyword)) {
                suggestions.push({
                    text: extractMatchContext(product.description, keyword),
                    type: SearchResultType.PRODUCT,
                    id: product.id,
                    weight: SEARCH_WEIGHTS.PRODUCT_DESC,
                });
            }
        });

        // 5. 处理分类搜索结果
        categories.forEach(category => {
            suggestions.push({
                text: category.name,
                type: SearchResultType.CATEGORY,
                id: category.id,
                weight: SEARCH_WEIGHTS.CATEGORY,
            });
        });

        // 6. 处理标签搜索结果
        tags.forEach(tag => {
            suggestions.push({
                text: tag.name,
                type: SearchResultType.TAG,
                id: tag.id,
                weight: SEARCH_WEIGHTS.TAG,
            });
        });

        // 7. 按权重排序并限制返回数量
        return {
            suggestions: suggestions
                .sort((aItem, bItem) => bItem.weight - aItem.weight)
                .slice(0, SEARCH_CONFIG.MAX_RESULTS),
        };
    }

    /**
     * 搜索商品。
     * 支持多种搜索方式:
     * 1. 直接通过关键词匹配商品标题和描述
     * 2. 通过完全匹配分类名，找到所有子分类下的商品
     * 3. 通过完全匹配标签名，找到所有相关商品
     * 4. 使用权重系统对不同来源的搜索结果进行排序
     * 5. 支持分页
     * 6. 结果去重，同一商品多个来源取最高权重
     * @param dto 搜索商品请求DTO
     * @returns 搜索商品响应DTO
     */
    async searchProducts (dto: {
        keyword?: string;
        page?: number;
        pageSize?: number;
    }): Promise<SearchProductResDto> {
        const {
            keyword,
            page = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE,
            pageSize = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE_SIZE,
        } = dto;

        // 1. 直接搜索商品
        const productsFromKeyword = await this.searchProductsByKeyword(keyword);

        // 2. 通过分类搜索商品
        const productsFromCategory = await this.searchProductsByCategory(keyword);

        // 3. 通过标签搜索商品
        const productsFromTags = await this.searchProductsByTags(keyword);

        // 4. 合并结果并去重
        const mergedProducts = mergeAndDedupeProducts([
            ...productsFromKeyword,
            ...productsFromCategory,
            ...productsFromTags,
        ]);

        // 5. 按权重排序并分页
        const sortedProducts = mergedProducts.sort((aItem, bItem) => bItem.weight - aItem.weight);
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedProducts = sortedProducts.slice(start, end);

        return {
            list: paginatedProducts.map(product => toProductDto(product)),
            total: sortedProducts.length,
            page,
            pageSize,
        };
    }

    /**
     * 根据关键词直接搜索商品
     */
    private async searchProductsByKeyword (keyword: string) {
        const products = await this.productRepository.find({
            where: [
                { isOnSale: SALE_STATUS.sale },
                { title: Like(`%${keyword}%`) },
                { description: Like(`%${keyword}%`) },
            ],
            relations: ['category', 'tags'],
        });

        return products.map(product => {
            let weight = 0;
            // 标题匹配权重
            if (product.title.includes(keyword)) {
                weight += SEARCH_PRODUCT_WEIGHTS.TITLE_MATCH;
            }
            // 描述匹配权重
            if (product.description?.includes(keyword)) {
                weight += SEARCH_PRODUCT_WEIGHTS.DESC_MATCH;
            }
            return { ...product, weight };
        });
    }

    /**
     * 根据分类名搜索商品
     */
    private async searchProductsByCategory (keyword: string) {
        // 1. 查找完全匹配的分类
        const matchedCategories = await this.categoryRepository.find({ where: { name: keyword } });

        if (!matchedCategories.length) return [];

        // 2. 获取所有匹配分类的最底层子分类ID
        const leafCategoryIds: number[] = [];
        for (const category of matchedCategories) {
            const leafCategories = await this.findLeafCategories(category.id);
            for (const item of leafCategories) {
                leafCategoryIds.push(item.id);
            }
        }

        if (!leafCategoryIds.length) return [];

        // 3. 查找这些分类下的商品
        const products = await this.productRepository.find({
            where: { categoryId: In(leafCategoryIds), isOnSale: SALE_STATUS.sale },
            relations: ['category', 'tags'],
        });

        return products.map(product => ({
            ...product,
            weight: SEARCH_PRODUCT_WEIGHTS.CATEGORY_MATCH,
        }));
    }

    /**
     * 根据标签名搜索商品
     */
    private async searchProductsByTags (keyword: string) {
        // 1. 查找完全匹配的标签
        const matchedTags = await this.tagRepository.find({
            where: { name: keyword },
            relations: ['products', 'products.category', 'products.tags'],
        });

        if (!matchedTags.length) return [];

        // 2. 收集所有标签下的商品
        const products = matchedTags.flatMap(tag => tag.products);

        return products.map(product => ({
            ...product,
            weight: SEARCH_PRODUCT_WEIGHTS.TAG_MATCH,
        })).filter((item) => item.isOnSale === SALE_STATUS.sale);
    }

    /**
     * 查找分类的所有最底层子分类
     */
    private async findLeafCategories (categoryId: number): Promise<Category[]> {
        const category = await this.categoryRepository.findOne({
            where: { id: categoryId },
            relations: ['children'],
        });

        if (!category) return [];

        if (!category.children?.length) {
            return [category];
        }

        const leafCategories: Category[] = [];
        for (const child of category.children) {
            const childLeafCategories = await this.findLeafCategories(child.id);
            leafCategories.push(...childLeafCategories);
        }

        return leafCategories;
    }

    /**
     * 搜索最新商品，支持分页
     */
    async searchLatestProducts (dto: { page: number, pageSize: number }): Promise<SearchProductResDto> {
        const { page = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE, pageSize = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE_SIZE } = dto;

        const [products, total] = await this.productRepository.findAndCount({
            where: { isOnSale: SALE_STATUS.sale },
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });

        return {
            list: products.map(product => toProductDto(product)),
            total,
            page,
            pageSize,
        };
    }

    /**
     * 根据id查找分类下的商品
     */
    async findCategoryProducts (dto: { id: number, page: number, pageSize: number }): Promise<SearchProductResDto> {
        const { id, page = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE, pageSize = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE_SIZE } = dto;
        const leafCategories = await this.findLeafCategories(id);
        const [products, total] = await this.productRepository.findAndCount({
            where: { categoryId: In(leafCategories.map(item => item.id)), isOnSale: SALE_STATUS.sale },
            relations: ['category', 'tags'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list: products.map(product => toProductDto(product)),
            total,
            page,
            pageSize,
        };
    }

    /** 根据id查找标签下的商品 */
    async findTagProducts (dto: { id: number, page: number, pageSize: number }): Promise<SearchProductResDto> {
        const { id, page = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE, pageSize = SEARCH_PRODUCT_CONFIG.DEFAULT_PAGE_SIZE } = dto;
        const [products, total] = await this.productRepository.findAndCount({
            where: { tags: { id }, isOnSale: SALE_STATUS.sale },
            relations: ['category', 'tags'],
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list: products.map(product => toProductDto(product)),
            total,
            page,
            pageSize,
        };
    }
}
