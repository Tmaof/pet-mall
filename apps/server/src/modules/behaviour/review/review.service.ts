import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { OrderStatus } from '@/modules/order/enum';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReviews } from './entity/product_reviews.entity';
import { ReviewLikes } from './entity/review_likes.entity';
import { ReviewReplies } from './entity/review_replies.entity';
import { ReviewSortType, ReviewType } from './enum';
import {
    CreateProductReviewDto, CreateReviewReplyDto, GetPendingReviewsDto, GetProductReviewsDto, GetReviewRepliesDto, LikeReviewDto
} from './req-dto';
import { PendingReviewProductsDto, ProductReviewListDto, ReviewReplyListDto } from './res-dto';

@Injectable()
export class ReviewService {
    constructor (
        @InjectRepository(ProductReviews)
        private readonly productReviewsRepository: Repository<ProductReviews>,
        @InjectRepository(ReviewReplies)
        private readonly reviewRepliesRepository: Repository<ReviewReplies>,
        @InjectRepository(ReviewLikes)
        private readonly reviewLikesRepository: Repository<ReviewLikes>,
        @InjectRepository(OrderItem)
        private readonly orderItemRepository: Repository<OrderItem>,
    ) {}

    /**
     * 发布商品评论
     */
    async createProductReview (clientId: number, dto: CreateProductReviewDto): Promise<ProductReviews> {
        if (dto?.images?.length > 10) {
            throw new BadRequestException('最多只能上传10张图片');
        }
        // 验证订单项是否存在且属于当前用户
        const orderItem = await this.orderItemRepository.findOne({
            where: {
                id: dto.orderItemId,
                order: {
                    clientId,
                    status: OrderStatus.COMPLETED,
                },
            },
            relations: ['order'],
        });
        if (!orderItem) {
            throw new NotFoundException('订单项不存在或未完成');
        }
        // 检查是否已经评论过
        const existingReview = await this.productReviewsRepository.findOne({ where: { productId: dto.productId, orderItemId: orderItem.id, clientId } });

        if (existingReview) {
            throw new NotFoundException('您已经评论过该商品了哦');
        }

        // 创建评论
        const review = this.productReviewsRepository.create({
            productId: dto.productId,
            orderItemId: orderItem.id,
            clientId,
            rating: dto.rating,
            content: dto.content,
            images: dto.images,
        });

        return await this.productReviewsRepository.save(review);
    }

    /**
     * 发布回复评论
     */
    async createReviewReply (clientId: number, dto: CreateReviewReplyDto): Promise<ReviewReplies> {
        // 验证根评论是否存在
        const rootReview = await this.productReviewsRepository.findOne({ where: { id: dto.rootReviewId } });

        if (!rootReview) {
            throw new NotFoundException('根评论不存在');
        }

        let parentReply: ReviewReplies | null = null;
        // 验证父评论是否存在
        if (dto.parentId) {
            parentReply = await this.reviewRepliesRepository.findOne({ where: { id: dto.parentId, rootReviewId: dto.rootReviewId } });
            if (!parentReply) {
                throw new NotFoundException('父评论不存在');
            }
        }

        // 创建回复
        const reply = this.reviewRepliesRepository.create({
            rootReviewId: dto.rootReviewId,
            parentId: dto.parentId,
            clientId,
            replyToClientId: parentReply ? parentReply.clientId : rootReview.clientId,
            content: dto.content,
        });

        const savedReply = await this.reviewRepliesRepository.save(reply);

        return savedReply;
    }

    /**
     * 删除评论
     */
    async deleteReview (clientId: number, reviewId: number, type: ReviewType): Promise<void> {
        if (!reviewId || Number.isNaN(reviewId)) {
            throw new BadRequestException('评论ID无效');
        }
        // 删除商品评论
        if (type === ReviewType.PRODUCT) {
            const review = await this.productReviewsRepository.findOne({ where: { id: reviewId, clientId } });

            if (!review) {
                throw new NotFoundException('评论不存在');
            }

            // 删除所有回复
            await this.reviewRepliesRepository.delete({ rootReviewId: reviewId });
            // 删除评论
            await this.productReviewsRepository.delete(reviewId);
        } else if (type === ReviewType.REPLY) {
            // 删除回复评论
            const reply = await this.reviewRepliesRepository.findOne({ where: { id: reviewId, clientId } });

            if (!reply) {
                throw new NotFoundException('回复不存在');
            }

            // 删除回复
            // TODO：如果回复有子回复，则一并删除，递归删除子评论
            await this.reviewRepliesRepository.delete(reviewId);
        }
    }

    /**
     * 点赞评论
     */
    async likeReview (clientId: number, dto: LikeReviewDto): Promise<void> {
        // 检查是否已经点赞
        const existingLike = await this.reviewLikesRepository.findOne({
            where: {
                clientId,
                targetId: dto.reviewId,
                targetType: dto.type,
            },
        });

        if (existingLike) {
            throw new NotFoundException('已经点赞过');
        }

        // 创建点赞记录
        await this.reviewLikesRepository.save({
            clientId,
            targetId: dto.reviewId,
            targetType: dto.type,
        });

        // 更新点赞数
        if (dto.type === ReviewType.PRODUCT) {
            await this.productReviewsRepository.increment(
                { id: dto.reviewId },
                'likeCount',
                1,
            );
        } else if (dto.type === ReviewType.REPLY) {
            await this.reviewRepliesRepository.increment(
                { id: dto.reviewId },
                'likeCount',
                1,
            );
        }
    }

    /**
     * 取消点赞评论
     */
    async cancelLikeReview (clientId: number, dto: LikeReviewDto): Promise<void> {
        const existingLike = await this.reviewLikesRepository.findOne({
            where: {
                clientId,
                targetId: dto.reviewId,
                targetType: dto.type,
            },
        });
        if (!existingLike) {
            throw new NotFoundException('未点赞');
        }
        await this.reviewLikesRepository.delete(existingLike.id);
        if (dto.type === ReviewType.PRODUCT) {
            await this.productReviewsRepository.decrement(
                { id: dto.reviewId },
                'likeCount',
                1,
            );
        } else if (dto.type === ReviewType.REPLY) {
            await this.reviewRepliesRepository.decrement(
                { id: dto.reviewId },
                'likeCount',
                1,
            );
        }
    }

    /**
     * 获取商品评论列表
     */
    async getProductReviews (clientId: number, dto: GetProductReviewsDto): Promise<ProductReviewListDto> {
        const queryBuilder = this.productReviewsRepository
            .createQueryBuilder('review')
            .leftJoinAndSelect('review.client', 'client')
            .leftJoinAndSelect('review.replies', 'replies')
            .where('review.productId = :productId', { productId: dto.productId });

        // 添加排序
        if (dto.sortType === ReviewSortType.MOST_LIKED) {
            queryBuilder.orderBy('review.likeCount', 'DESC');
        } else {
            queryBuilder.orderBy('review.createdAt', 'DESC');
        }

        // 分页
        const page = dto.page ?? 1;
        const pageSize = dto.pageSize ?? 10;
        const [list, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        const likedList = await Promise.all(list.map(async review => {
            const count = await this.reviewLikesRepository.count({ where: { clientId, targetId: review.id, targetType: ReviewType.PRODUCT } });
            return count > 0;
        }));

        return {
            list: list.map((review, index) => ({
                productReviewId: review.id,
                productId: review.productId,
                clientId: review.clientId,
                clientname: review.client.clientname,
                clientAvatar: review.client.avatar,
                rating: review.rating,
                content: review.content,
                images: review.images,
                replyCount: review.replies.length,
                likeCount: review.likeCount,
                createdAt: review.createdAt,
                liked: likedList[index],
            })),
            total,
            page,
            pageSize,
        };
    }

    /**
     * 获取评论回复列表
     */
    async getReviewReplies (clientId: number, dto: GetReviewRepliesDto): Promise<ReviewReplyListDto> {
        const queryBuilder = this.reviewRepliesRepository
            .createQueryBuilder('reply')
            .leftJoinAndSelect('reply.client', 'client')
            .leftJoinAndSelect('reply.replyToClient', 'replyToClient')
            .leftJoinAndSelect('reply.children', 'children')
            .where('reply.rootReviewId = :rootReviewId', { rootReviewId: dto.rootReviewId });

        if (dto.parentId) {
            queryBuilder.andWhere('reply.parentId = :parentId', { parentId: dto.parentId });
        } else {
            queryBuilder.andWhere('reply.parentId IS NULL');
        }

        // 添加排序
        if (dto.sortType === ReviewSortType.MOST_LIKED) {
            queryBuilder.orderBy('reply.likeCount', 'DESC');
        } else {
            queryBuilder.orderBy('reply.createdAt', 'DESC');
        }

        // 分页
        const page = dto.page ?? 1;
        const pageSize = dto.pageSize ?? 10;
        const [list, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        // 客户是否点赞了该评论
        const likedList = await Promise.all(list.map(async review => {
            const count = await this.reviewLikesRepository.count({ where: { clientId, targetId: review.id, targetType: ReviewType.REPLY } });
            return count > 0;
        }));

        return {
            list: list.map((reply, index) => ({
                replyId: reply.id,
                rootReviewId: reply.rootReviewId,
                parentId: reply.parentId,
                clientId: reply.clientId,
                clientname: reply.client.clientname,
                clientAvatar: reply.client.avatar,
                replyToClientId: reply.replyToClientId,
                replyToClientname: reply.replyToClient?.clientname,
                content: reply.content,
                likeCount: reply.likeCount,
                createdAt: reply.createdAt,
                replyCount: reply.children.length,
                liked: likedList[index],
            })),
            total,
            page,
            pageSize,
        };
    }

    /** 获取一个商品的【商品评论】数 */
    async getProductReviewCount (productId: number): Promise<number> {
        return await this.productReviewsRepository.count({ where: { productId } });
    }

    /**
     * 获取当前客户的待评价商品列表
     */
    async getPendingReviewProducts (clientId: number, dto: GetPendingReviewsDto): Promise<PendingReviewProductsDto> {
        const queryBuilder = this.orderItemRepository.createQueryBuilder('orderItem')
            .leftJoinAndSelect('orderItem.product', 'product')
            .leftJoinAndSelect('orderItem.order', 'order')
            .where('order.clientId = :clientId', { clientId })
            .andWhere('order.status = :status', { status: OrderStatus.COMPLETED })
            .andWhere('orderItem.productReviews IS NULL'); // 未评论

        // 分页
        const page = dto.page ?? 1;
        const pageSize = dto.pageSize ?? 10;
        const [list, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .getManyAndCount();

        return {
            list: list.map(orderItem => ({
                orderItemId: orderItem.id,
                productId: orderItem.productId,
                id: orderItem.product.id,
                categoryId: orderItem.product.categoryId,
                title: orderItem.product.title,
                mainImage: orderItem.product.mainImage,
                quantity: orderItem.quantity,
                price: orderItem.product.price,
                stock: orderItem.product.stock,
                isOnSale: orderItem.product.isOnSale,
                createdAt: orderItem.product.createdAt,
                updatedAt: orderItem.product.updatedAt,
                tags: orderItem.product.tags,
            })),
            total,
            page,
            pageSize,
        };
    }
}
