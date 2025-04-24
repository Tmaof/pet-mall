import { Client } from '@/modules/client/client/client.entity';
import {
    Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';
import { ReviewType } from '../enum';

@Entity('review_likes')
export class ReviewLikes {
    @PrimaryGeneratedColumn({ comment: '主键ID' })
        id: number;

    @Column({ name: 'client_id', comment: '点赞用户的ID' })
    @Index()
        clientId: number;

    @Column({ name: 'target_id', comment: '被点赞对象的ID' })
    @Index()
        targetId: number;

    @Column({ name: 'target_type', comment: '点赞目标类型：1-商品评论，2-回复评论' })
        targetType: ReviewType;

    @CreateDateColumn({ name: 'created_at', comment: '点赞时间' })
        createdAt: Date;

    /**
     * 一条点赞属于一个客户，一个客户可以有多条点赞
     */
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
        client: Client;
}
