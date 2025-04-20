import { Client } from '@/modules/client/client/client.entity';
import { Product } from '@/modules/product/product/product.entity';
import {
    Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn
} from 'typeorm';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn({ comment: '购物车ID，主键' })
        id: number;

    /**
     * 外键：客户ID。
     * 一个客户可以有多个购物车记录，但是一个购物车记录只能属于一个客户。
     * 当客户删除时，级联删除购物车记录。
     */
    @ManyToOne(() => Client, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'client_id' })
        client : Client;

    /**
     * 外键：商品ID。
     * 一个商品可以属于多个购物车记录，但是一个购物车记录只包含一个商品。
     */
    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
        product: Product;

    @Column({ comment: '购买该商品的数量', nullable: false })
        count: number;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;
}
