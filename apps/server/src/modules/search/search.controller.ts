import { getCommonRes } from '@/utils';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchResultType } from './enum';
import { SearchSuggestReqDto } from './req-dto';
import { SearchProductDto } from './req-dto/search-product.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor (private readonly searchService: SearchService) {}

    /**
   * 获取搜索建议
   * @param dto 搜索建议请求DTO
   */
    @Get('suggest')
    async getSuggestions (@Query() dto: SearchSuggestReqDto) {
        const data = await this.searchService.getSuggestions(dto);
        return getCommonRes({ data });
    }

    /**
     * 搜索商品
     * @param dto 搜索商品请求DTO
     */
    @Get('products')
    async searchProducts (@Query() dto: SearchProductDto) {
        const { keyword, page, pageSize, type, id } = dto;

        // 如果 有分类id，则搜索分类下的商品
        if (type === SearchResultType.CATEGORY && id) {
            const data = await this.searchService.findCategoryProducts({ id, page, pageSize });
            return getCommonRes({ data });
        }

        // 如果 有标签id，则搜索标签下的商品
        if (type === SearchResultType.TAG && id) {
            const data = await this.searchService.findTagProducts({ id, page, pageSize });
            return getCommonRes({ data });
        }


        // 如果 keyword 为空，则搜索最新商品
        if (!keyword) {
            const data = await this.searchService.searchLatestProducts({ page, pageSize });
            return getCommonRes({ data });
        }

        // 根据keyword搜索商品。去搜索 商品标题 和 商品描述， 分类名，标签名
        const data = await this.searchService.searchProducts(dto);
        return getCommonRes({ data });
    }
}
