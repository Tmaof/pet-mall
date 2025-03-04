import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    JoinColumn
} from 'typeorm';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn({ comment: '分类ID，主键' })
        id: number;

    @Column({
        type: 'varchar',
        length: 50,
        comment: '分类名称',
    })
        name: string;

    @Column({
        type: 'int',
        default: 0,
        comment: '排序权重',
    })
        sortOrder: number;

    @Column({
        type: 'boolean',
        default: true,
        comment: '是否显示',
    })
        isVisible: boolean;

    /** 一个子分类只能有一个父分类 */
    @ManyToOne(() => Category, category => category.children)
    @JoinColumn({ name: 'parent_id' })
        parent: Category;

    /** 一个父分类可以有多个子分类 */
    @OneToMany(() => Category, category => category.parent)
        children: Category[];
}
