import { getCommonRes } from '@/utils';
import { Controller, Get, Query } from '@nestjs/common';
import { SearchSuggestDto } from './req-dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
    constructor (private readonly searchService: SearchService) {}

    /**
   * 获取搜索建议
   * @param dto 搜索建议请求DTO
   */
    @Get('suggest')
    async getSuggestions (@Query() dto: SearchSuggestDto) {
        const data = await this.searchService.getSuggestions(dto);
        return getCommonRes({ data });
    }
}
