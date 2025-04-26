import request from '@/utils/request';
import {
  CreateProductReviewDto,
  CreateReviewReplyDto,
  GetPendingReviewsDto,
  GetProductReviewsDto,
  GetReviewRepliesDto,
  LikeReviewDto,
} from './req-dto';
import { PendingReviewProductsDto, ProductReviewListDto, ReviewReplyListDto } from './res-dto';

/** 获取商品评论列表 */
export const getProductReviewList = (params: GetProductReviewsDto) =>
  request<ProductReviewListDto>({
    url: 'reviews/product',
    method: 'GET',
    params,
  });

/** 获取评论的回复列表 */
export const getReviewReplyList = (params: GetReviewRepliesDto) =>
  request<ReviewReplyListDto>({
    url: 'reviews/reply',
    method: 'GET',
    params,
  });

/** 回复评论 */
export const replyReview = (data: CreateReviewReplyDto) =>
  request({
    url: 'reviews/reply',
    method: 'POST',
    data,
  });

/** 点赞评论 */
export const likeReview = (data: LikeReviewDto) =>
  request({
    url: 'reviews/like',
    method: 'POST',
    data,
  });

/** 取消点赞评论 */
export const cancelLikeReview = (data: LikeReviewDto) =>
  request({
    url: 'reviews/like',
    method: 'DELETE',
    data,
  });

/** 获取一个商品的【商品评论】数 */
export const getProductReviewCount = (id: number) =>
  request<number>({
    url: `reviews/product/count/${id}`,
    method: 'GET',
  });

/** 获取待评价商品列表 */
export const getPendingReviewProducts = (dto: GetPendingReviewsDto) =>
  request<PendingReviewProductsDto>({
    url: '/reviews/product/pending',
    method: 'GET',
    params: dto,
  });

/** 发布商品评价 */
export const publishProductReview = (dto: CreateProductReviewDto) =>
  request({
    url: '/reviews/product',
    method: 'POST',
    data: dto,
  });
