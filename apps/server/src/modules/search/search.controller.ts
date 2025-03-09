import { getCommonRes } from '@/utils';
import { Controller, Get, Query } from '@nestjs/common';
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
        const data = await this.searchService.searchProducts(dto);
        return getCommonRes({ data });
    }
}
