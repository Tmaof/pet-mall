import { extractMatchContext } from '@/utils';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Category } from '../product/category/category.entity';
import { Product } from '../product/product/product.entity';
import { Tag } from '../product/tag/tag.entity';
import { SEARCH_CONFIG, SEARCH_WEIGHTS } from './constants';
import { SearchResultType } from './enum';
import { SearchSuggestDto } from './req-dto';
import { SearchSuggestItem, SearchSuggestResDto } from './res-dto';
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
    async getSuggestions (dto: SearchSuggestDto): Promise<SearchSuggestResDto> {
        const { keyword } = dto;
        const suggestions: SearchSuggestItem[] = [];

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
}
