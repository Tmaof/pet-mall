import { Client } from '@/modules/client/client/client.entity';
import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { ProductReviews } from './product_reviews.entity';

@Entity('review_replies')
export class ReviewReplies {
    @PrimaryGeneratedColumn({ comment: '主键ID' })
        id: number;

    @Column({ name: 'parent_id', nullable: true, comment: '父评论ID，回复评论时指向review_replies.id，回复商品评论时为NULL' })
    @Index()
        parentId?: number;

    @Column({ name: 'root_review_id', comment: '根评论ID，指向最原始的商品评论' })
    @Index()
        rootReviewId: number;

    @Column({ name: 'client_id', comment: '发表回复的用户ID' })
    @Index()
        clientId: number;

    @Column({ name: 'reply_to_client_id', nullable: true, comment: '被回复的用户ID' })
    @Index()
        replyToClientId?: number;

    @Column({ type: 'text', comment: '回复的文本内容' })
        content: string;

    @Column({ name: 'like_count', default: 0, comment: '该回复获得的点赞数' })
        likeCount: number;

    @CreateDateColumn({ name: 'created_at', comment: '回复创建时间' })
        createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at', comment: '回复更新时间' })
        updatedAt: Date;

    /**
     * 一条回复属于一条商品评论，一个商品评论可以有多条回复
     */
    @ManyToOne(() => ProductReviews)
    @JoinColumn({ name: 'root_review_id' })
        rootReview: ProductReviews;

    /**
     * 一条回复属于一条父回复，一个父回复可以有多条回复。
     * 在父评论删除时，级联删除子评论，递归删除子评论的评论
     */
    @ManyToOne(() => ReviewReplies, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_id' })
        parent: ReviewReplies;

    /**
     * 一条回复属于一个客户，一个客户可以有多条回复
     */
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
        client: Client;

    /**
     * 一条回复属于一个被回复的客户，一个被回复的客户可以有多条回复
     */
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'reply_to_client_id' })
        replyToClient: Client;

    /**
     * 一条父回复可以有多个子回复，一个子回复属于一条父回复
     */
    @OneToMany(() => ReviewReplies, reply => reply.parent)
        children: ReviewReplies[];
}
