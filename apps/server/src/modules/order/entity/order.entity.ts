import { Client } from '@/modules/client/client/client.entity';
import { PaymentMethod } from '@/modules/payment/enum';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import { OrderStatus, ShippingMethod } from '../enum';
import { AddressSnapshotDto } from '../res-dto';
import { OrderItem } from './order-item.entity';

@Entity('order')
export class Order {
    @PrimaryGeneratedColumn({ comment: '订单ID' })
        id: number;

    @Column({
        name: 'client_id',
        type: 'bigint',
        comment: '客户ID',
    })
        clientId: number;

    @Column({
        name: 'total_amount',
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '订单总金额',
    })
        totalAmount: number;

    @Column({
        type: 'tinyint',
        default: OrderStatus.PENDING_PAYMENT,
        comment: '订单状态',
    })
        status: OrderStatus;

    @Column({
        name: 'address_snapshot',
        type: 'json',
        nullable: true,
        comment: '收货地址快照',
    })
        addressSnapshot: AddressSnapshotDto;

    @Column({
        name: 'payment_method',
        type: 'enum',
        enum: PaymentMethod,
        nullable: true,
        comment: '支付方式',
    })
        paymentMethod: PaymentMethod;

    @Column({
        name: 'payment_time',
        type: 'datetime',
        nullable: true,
        comment: '支付时间',
    })
        paymentTime: Date;

    @Column({
        name: 'payment_no',
        type: 'varchar',
        length: 100,
        nullable: true,
        comment: '支付流水号',
    })
        paymentNo: string;

    @Column({
        name: 'shipping_method',
        type: 'varchar',
        length: 50,
        nullable: true,
        comment: '配送方式',
    })
        shippingMethod: ShippingMethod;

    @Column({
        name: 'tracking_number',
        type: 'varchar',
        length: 100,
        nullable: true,
        comment: '物流单号',
    })
        trackingNumber: string;

    @Column({
        name: 'shipping_company',
        type: 'varchar',
        length: 100,
        nullable: true,
        comment: '物流公司',
    })
        shippingCompany: string;

    @Column({
        name: 'remark',
        type: 'varchar',
        length: 500,
        nullable: true,
        comment: '订单备注',
    })
        remark: string;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
        comment: '更新时间',
    })
        updatedAt: Date;

    // 关联关系
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
        client: Client;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
        orderItems: OrderItem[];
}
