import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReviews } from './entity/product_reviews.entity';
import { ReviewLikes } from './entity/review_likes.entity';
import { ReviewReplies } from './entity/review_replies.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductReviews,
            ReviewReplies,
            ReviewLikes,
            OrderItem,
        ]),
    ],
    controllers: [ReviewController],
    providers: [ReviewService],
})
export class ReviewModule {}
