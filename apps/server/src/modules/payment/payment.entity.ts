import { Order } from '@/modules/order/entity/order.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { PaymentMethod, PaymentStatus } from './enum';


@Entity()
export class Payment {
    @PrimaryGeneratedColumn()
        id: number;

    /** 支付金额 */
    @Column('decimal', { precision: 10, scale: 2, comment: '支付金额' })
        amount: number;

    /** 支付状态 */
    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
        comment: '支付状态',
    })
        status: PaymentStatus;

    /** 支付方式 */
    @Column({
        type: 'enum',
        enum: PaymentMethod,
        comment: '支付方式',
    })
        paymentMethod: PaymentMethod;

    /** 商户订单号 */
    @Column({ length: 64, comment: '商户订单号' })
        outTradeNo: string;

    /** 支付平台交易号（支付宝，微信。。。） */
    @Column({ length: 64, nullable: true, comment: '支付平台交易号' })
        transactionId: string;

    /** 中介平台交易id，例如：h5zhifu.com */
    @Column({ length: 64, nullable: true, comment: '中介平台交易id' })
        agencyTransactionId: string;

    /** 支付二维码链接 */
    @Column({ length: 512, nullable: true, comment: '支付二维码链接' })
        codeUrl: string;

    /** 支付时间 */
    @Column({ nullable: true, comment: '支付时间' })
        paidAt: Date;

    /** 创建时间 */
    @CreateDateColumn({ comment: '创建时间', type: 'timestamp' })
        createdAt: Date;

    /** 更新时间 */
    @UpdateDateColumn({ comment: '更新时间', type: 'timestamp' })
        updatedAt: Date;

    /** 关联订单 */
    @OneToOne(() => Order)
    @JoinColumn({ name: 'orderId' })
        order: Order;
}
