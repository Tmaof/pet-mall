import { Client } from '@/modules/client/client/client.entity';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Product } from '@/modules/product/product/product.entity';
import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ReviewReplies } from './review_replies.entity';

@Entity('product_reviews')
export class ProductReviews {
    @PrimaryGeneratedColumn({ comment: '主键ID' })
        id: number;

    @Column({ name: 'product_id', comment: '商品ID' })
    @Index()
        productId: number;

    @Column({ name: 'order_item_id', comment: '订单项ID，用于验证购买记录' })
    @Index()
        orderItemId: number;

    @Column({ name: 'client_id', comment: '评论用户ID' })
    @Index()
        clientId: number;

    @Column({ comment: '评分(1-5)，用户对商品的评分' })
        rating: number;

    @Column({ type: 'text', nullable: true, comment: '评论文本内容' })
        content: string;

    @Column({ type: 'json', nullable: true, comment: '图片URL数组，最多10张图片' })
        images: string[];

    @Column({ name: 'like_count', default: 0, comment: '该评论获得的点赞数' })
        likeCount: number;

    @CreateDateColumn({ name: 'created_at', comment: '评论创建时间' })
        createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', comment: '评论更新时间' })
        updatedAt: Date;

    /**
     * 一条商品评论属于一个商品，一个商品可以有多条评论
     */
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
        product: Product;

    /**
     * 一条商品评论属于一个订单项，一个订单项可以有多条评论
     */
    @ManyToOne(() => OrderItem)
    @JoinColumn({ name: 'order_item_id' })
        orderItem: OrderItem;

    /**
     * 一条商品评论属于一个客户，一个客户可以有多条评论
     */
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
        client: Client;

    /**
     * 一条商品评论可以有多个回复，一个回复属于一条商品评论
     */
    @OneToMany(() => ReviewReplies, reply => reply.rootReview)
        replies: ReviewReplies[];
}
