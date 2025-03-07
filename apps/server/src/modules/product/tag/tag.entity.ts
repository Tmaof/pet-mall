import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';

@Entity('tag')
export class Tag {
    @PrimaryGeneratedColumn({ comment: '标签ID，主键' })
        id: number;

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        comment: '标签名称',
    })
        name: string;

    /** 一个标签 可以 有多个商品 */
    @ManyToMany(() => Product, (product) => product.tags)
    @JoinTable({ name: 'product_tag' })
        products: Product[];
}
