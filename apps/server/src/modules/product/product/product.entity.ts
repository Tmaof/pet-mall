import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Category } from '../category/category.entity';
import { SALE_STATUS } from './enum';

@Entity('product')
export class Product {
    @PrimaryGeneratedColumn({ comment: '商品ID，主键' })
        id: number;

    @Column({
        type: 'varchar',
        length: 100,
        comment: '商品标题',
    })
        title: string;

    @Column({
        name: 'category_id',
        type: 'bigint',
        comment: '分类ID',
    })
        categoryId: number;

    @Column({
        name: 'main_image',
        type: 'varchar',
        length: 255,
        comment: '主图URL',
    })
        mainImage: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: '商品描述',
    })
        description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
        comment: '价格',
    })
        price: number;

    @Column({
        type: 'int',
        default: 0,
        comment: '库存',
    })
        stock: number;

    @Column({
        name: 'is_on_sale',
        type: 'tinyint',
        default: SALE_STATUS.sale,
        comment: '是否上架',
    })
        isOnSale: number;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        nullable: true,
        comment: '最后更新时间',
    })
        updatedAt: Date;

    /** 关联分类，一个分类有多个商品 */
    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
        category: Category;
}
