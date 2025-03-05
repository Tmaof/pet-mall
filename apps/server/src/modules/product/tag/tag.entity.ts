import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
