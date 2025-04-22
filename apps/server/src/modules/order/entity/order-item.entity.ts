import { Product } from '@/modules/product/product/product.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_item')
export class OrderItem {
    @PrimaryGeneratedColumn({ comment: '订单项ID' })
        id: number;

    @Column({
        name: 'order_id',
        type: 'bigint',
        comment: '订单ID',
    })
        orderId: number;

    @Column({
        name: 'product_id',
        type: 'bigint',
        comment: '商品ID',
    })
        productId: number;

    @Column({
        type: 'int',
        default: 1,
        comment: '购买数量',
    })
        quantity: number;

    @Column({
        name: 'title_snapshot',
        type: 'varchar',
        length: 100,
        comment: '商品标题快照',
    })
        titleSnapshot: string;

    @Column({
        name: 'main_image_snapshot',
        type: 'varchar',
        length: 255,
        nullable: true,
        comment: '商品主图快照',
    })
        mainImageSnapshot: string;

    @Column({
        name: 'unit_price_snapshot',
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '单价快照',
    })
        unitPriceSnapshot: number;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;

    // 关联关系
    @ManyToOne(() => Order, (order) => order.orderItems)
    @JoinColumn({ name: 'order_id' })
        order: Order;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
        product: Product;
}
