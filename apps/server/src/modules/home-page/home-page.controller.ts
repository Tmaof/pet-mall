import { getCommonRes } from '@/utils';
import { Controller, Get } from '@nestjs/common';
import { HomePageService } from './home-page.service';

@Controller('home-page')
export class HomePageController {
    constructor (private readonly homePageService: HomePageService) {}

    /**
     * 获取首页数据
     */
    @Get()
    async getHomePageData () {
        const data = await this.homePageService.getHomePageData();
        return getCommonRes({ data });
    }
}
