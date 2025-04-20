import { Client } from '@/modules/client/client/client.entity';
import { Product } from '@/modules/product/product/product.entity';
import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('favorite')
export class Favorite {
    @PrimaryGeneratedColumn({ comment: '收藏ID，主键' })
        id: number;

    /**
     * 外键：收藏的客户ID。
     * 一个客户可以有多个收藏记录，但是一个收藏记录只能属于一个客户。
     * 当客户删除时，级联删除收藏记录。
     */
    @ManyToOne(() => Client, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
        client : Client;

    /**
     * 外键：收藏的商品ID。
     * 一个商品可以属于多个收藏记录，但是一个收藏记录只包含一个商品。
     */
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
        product: Product;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;
}
