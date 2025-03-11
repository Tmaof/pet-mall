// https://github.com/StarCompute/RegionData
// 中国行政区划数据
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('region2023')
export class Region {
    @PrimaryGeneratedColumn({ unsigned: true, type: 'int', name: 'ID' })
        ID: number;

    @Column({
        type: 'varchar',
        length: 60,
        nullable: true,
        comment: '区域名称',
    })
        name: string;

    @Column({
        name: 'statisCode',
        type: 'varchar',
        length: 12,
        nullable: true,
        comment: '区域国标编码',
    })
        statisCode: string;

    @Index('idx_code')
    @Column({
        type: 'varchar',
        length: 6,
        nullable: true,
        comment: '区域编码',
    })
        code: string;

    @Column({
        type: 'varchar',
        length: 400,
        nullable: true,
        comment: '区域全称',
    })
        fullName: string;

    @Index('idx_parentID')
    @Column({
        type: 'tinyint',
        nullable: true,
        comment: '类型',
    })
        regionType: number;

    @Column({
        type: 'tinyint',
        default: 0,
        comment: '排列顺序',
    })
        sort: number;

    @Index('idx_parentID')
    @Column({
        type: 'int',
        nullable: true,
        comment: '上级对象编号',
    })
        parentID: number;

    @Column({
        type: 'tinyint',
        default: 0,
        comment: '是否删除',
    })
        isDel: number;

    @Column({
        type: 'float',
        nullable: true,
        comment: '维度',
    })
        lat: number;

    @Column({
        type: 'float',
        nullable: true,
        comment: '经度',
    })
        lng: number;
}

