import { JwtGuard } from '@/guards/jwt.guard';
import { getClientInfoOfReq, getCommonRes } from '@/utils';
import {
    ClassSerializerInterceptor, Controller, Delete, Get, Param, Post, Query, Req, UseGuards, UseInterceptors
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';

@Controller('favorite')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class FavoriteController {
    constructor (private favoriteService: FavoriteService,) {}
    /**
     * 添加收藏
     * @param productId 商品ID
     */
    @Post(':productId')
    async addFavorite (
    @Req() req,
        @Param('productId') productId: number,
    ) {
        const { clientId } = getClientInfoOfReq(req);
        await this.favoriteService.addFavorite(clientId, productId);
        return getCommonRes();
    }

    /**
     * 判断当前客户是否收藏了该商品
     * @param productId 商品ID
     */
    @Get('item/:productId')
    async isFavorite (@Req() req, @Param('productId') productId: number,) {
        const { clientId } = getClientInfoOfReq(req);
        const data = await this.favoriteService.isFavored(clientId, productId);
        return getCommonRes({ data });
    }

    /**
     * 获取当前客户的收藏列表
     */
    @Get('list')
    async getFavorites (
    @Req() req,
        @Query('page') page = 1,
        @Query('pageSize') pageSize = 10,
    ) {
        const { clientId } = getClientInfoOfReq(req);
        const data = await this.favoriteService.getFavoriteList(clientId, page, pageSize);
        return getCommonRes({ data });
    }

    /**
     * 取消收藏
     * @param productId 商品ID
     */
    @Delete(':productId')
    async removeFavorite (@Req() req, @Param('productId') productId: number,) {
        const { clientId } = getClientInfoOfReq(req);
        await this.favoriteService.removeFavorite(clientId, productId);
        return getCommonRes();
    }
}
