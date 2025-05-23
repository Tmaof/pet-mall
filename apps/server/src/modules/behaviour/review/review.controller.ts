import { ReqUser } from '@/decorator/index.decorator';
import { JwtGuardLoose } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body, Controller, Delete, Get, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { ReviewType } from './enum';
import {
    CreateProductReviewDto, CreateReviewReplyDto, GetPendingReviewsDto, GetProductReviewsDto, GetReviewedProductDto, GetReviewRepliesDto, LikeReviewDto
} from './req-dto';
import { ReviewService } from './review.service';

@Controller('reviews')
// @UseGuards(JwtGuard)
// 当请求中没有token时 不抛出401的错误
@UseGuards(JwtGuardLoose)
export class ReviewController {
    constructor (private readonly reviewService: ReviewService) {}

    /**
     * 发布商品评论
     */
    @Post('product')
    async createProductReview (
    @ReqUser('clientId') clientId: number,
        @Body() dto: CreateProductReviewDto,
    ) {
        const review = await this.reviewService.createProductReview(clientId, dto);
        return getCommonRes({ data: review });
    }

    /**
     * 发布回复评论
     */
    @Post('reply')
    async createReviewReply (
    @ReqUser('clientId') clientId: number,
        @Body() dto: CreateReviewReplyDto,
    ) {
        const reply = await this.reviewService.createReviewReply(clientId, dto);
        return getCommonRes({ data: reply });
    }

    /**
     * 删除评论
     */
    @Delete('delete/:id')
    async deleteReview (
    @ReqUser('clientId') clientId: number,
        @Param('id') id: string,
        @Query('type') type: ReviewType,
    ) {
        await this.reviewService.deleteReview(clientId, Number(id), type);
        return getCommonRes();
    }

    /**
     * 点赞评论
     */
    @Post('like')
    async likeReview (
    @ReqUser('clientId') clientId: number,
        @Body() dto: LikeReviewDto,
    ) {
        await this.reviewService.likeReview(clientId, dto);
        return getCommonRes();
    }

    /**
     * 取消点赞评论
     */
    @Delete('like')
    async cancelLikeReview (
    @ReqUser('clientId') clientId: number,
        @Body() dto: LikeReviewDto,
    ) {
        await this.reviewService.cancelLikeReview(clientId, dto);
        return getCommonRes();
    }

    /**
     * 获取商品评论列表
     */
    @Get('product')
    async getProductReviews (@ReqUser({ key: 'clientId', isThrow: false }) clientId: number, @Query() dto: GetProductReviewsDto) {
        const data = await this.reviewService.getProductReviews(clientId, dto);
        return getCommonRes({ data });
    }

    /**
     * 获取评论回复列表
     */
    @Get('reply')
    async getReviewReplies (@ReqUser({ key: 'clientId', isThrow: false }) clientId: number, @Query() dto: GetReviewRepliesDto) {
        const data = await this.reviewService.getReviewReplies(clientId, dto);
        return getCommonRes({ data });
    }

    /** 获取一个商品的【商品评论】数 */
    @Get('product/count/:id')
    async getProductReviewCount (@Param('id') id: string) {
        const data = await this.reviewService.getProductReviewCount(Number(id));
        return getCommonRes({ data });
    }

    /**
     * 获取当前客户的待评价商品列表
     */
    @Get('/product/pending')
    async getPendingReviewProducts (@ReqUser('clientId') clientId: number, @Query() dto: GetPendingReviewsDto) {
        const data = await this.reviewService.getPendingReviewProducts(clientId, dto);
        return getCommonRes({ data });
    }

    /** 获取当前客户的已评价商品列表 */
    @Get('/product/reviewed')
    async getReviewedProductList (@ReqUser('clientId') clientId: number, @Query() dto:GetReviewedProductDto) {
        const data = await this.reviewService.getReviewedProductList(clientId, dto);
        return getCommonRes({ data });
    }
}
