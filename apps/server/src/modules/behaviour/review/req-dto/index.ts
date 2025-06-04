export * from 'server-types';

// import { Type } from 'class-transformer';
// import {
//     IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength
// } from 'class-validator';
// import { ReviewSortType, ReviewType } from '../enum';

// /**
//  * 发布商品评论请求DTO
//  */
// export class CreateProductReviewDto {
//     /** 商品ID */
//     @IsInt()
//     @IsNotEmpty()
//         productId: number;

//     /** 订单项ID */
//     @IsInt()
//     @IsNotEmpty()
//         orderItemId: number;

//     /** 评分(1-5) */
//     @IsInt()
//     @Min(1)
//     @Max(5)
//         rating: number;

//     /** 评论内容 */
//     @IsString()
//     @MinLength(1)
//     @MaxLength(500)
//         content: string;

//     /** 图片URL数组 */
//     @IsOptional()
//     @IsArray()
//     @IsString({ each: true })
//         images?: string[];
// }

// /**
//  * 发布回复评论请求DTO
//  */
// export class CreateReviewReplyDto {
//     /** 根评论ID */
//     @IsInt()
//     @IsNotEmpty()
//         rootReviewId: number;

//     /** 父评论ID */
//     @IsOptional()
//     @IsInt()
//         parentId?: number;

//     /** 回复内容 */
//     @IsString()
//     @MinLength(1)
//     @MaxLength(500)
//         content: string;
// }

// /**
//  * 获取商品评论列表请求DTO
//  */
// export class GetProductReviewsDto {
//     /** 商品ID */
//     @IsInt()
//     @IsNotEmpty()
//         productId: number;

//     /** 页码 */
//     @IsInt()
//     @Min(1)
//     @Type(() => Number)
//     @IsOptional()
//         page? = 1;

//     /** 每页数量 */
//     @IsInt()
//     @Min(1)
//     @IsOptional()
//     @Type(() => Number)
//         pageSize? = 10;

//     /** 排序方式 */
//     @IsEnum(ReviewSortType)
//     @IsOptional()
//         sortType?: ReviewSortType = ReviewSortType.LATEST;
// }

// /**
//  * 获取评论回复列表请求DTO
//  */
// export class GetReviewRepliesDto {
//     /** 根评论ID */
//     @IsInt()
//     @IsNotEmpty()
//         rootReviewId: number;

//     /** 父评论ID */
//     @IsOptional()
//     @IsInt()
//         parentId?: number;

//     /** 页码 */
//     @IsInt()
//     @Min(1)
//     @Type(() => Number)
//     @IsOptional()
//         page? = 1;

//     /** 每页数量 */
//     @IsInt()
//     @Min(1)
//     @IsOptional()
//     @Type(() => Number)
//         pageSize? = 10;

//     /** 排序方式 */
//     @IsEnum(ReviewSortType)
//     @IsOptional()
//         sortType?: ReviewSortType = ReviewSortType.LATEST;
// }

// /**
//  * 点赞评论请求DTO
//  */
// export class LikeReviewDto {
//     /** 评论ID */
//     @IsInt()
//     @IsNotEmpty()
//         reviewId: number;

//     /** 评论类型 */
//     @IsEnum(ReviewType)
//     @IsNotEmpty()
//         type: ReviewType;
// }

// export class PaginationDto {
//     /** 页码 */
//     @IsInt()
//     @Min(1)
//     @Type(() => Number)
//     @IsOptional()
//         page? = 1;

//     /** 每页数量 */
//     @IsInt()
//     @Min(1)
//     @IsOptional()
//     @Type(() => Number)
//         pageSize? = 10;
// }

// /**
//  * 获取待评价商品列表请求DTO
//  */
// export class GetPendingReviewsDto extends PaginationDto{

// }

// /**
//  * 获取已评价商品列表请求DTO
//  */
// export class GetReviewedProductDto extends PaginationDto{

// }