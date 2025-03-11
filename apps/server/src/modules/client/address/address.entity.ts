import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Client } from '@/modules/client/client/client.entity';
import { IS_DEFAULT } from './enum';

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn({ comment: '地址ID' })
        id: number;

    @Column({
        name: 'client_id',
        type: 'bigint',
        comment: '客户ID',
    })
        clientId: number;

    @Column({
        type: 'varchar',
        length: 50,
        comment: '收货人姓名',
    })
        consignee: string;

    @Column({
        type: 'varchar',
        length: 20,
        comment: '联系电话',
    })
        phone: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: '省份',
    })
        province: string;

    @Column({
        name: 'province_code',
        type: 'varchar',
        length: 20,
        comment: '省份编码',
    })
        provinceCode: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: '城市',
    })
        city: string;

    @Column({
        name: 'city_code',
        type: 'varchar',
        length: 20,
        comment: '城市编码',
    })
        cityCode: string;

    @Column({
        type: 'varchar',
        length: 50,
        comment: '区县',
    })
        district: string;

    @Column({
        name: 'district_code',
        type: 'varchar',
        length: 20,
        comment: '区县编码',
    })
        districtCode: string;

    @Column({
        type: 'varchar',
        length: 200,
        comment: '详细地址',
    })
        detail: string;

    @Column({
        name: 'is_default',
        type: 'tinyint',
        width: 1,
        default: IS_DEFAULT.NO,
        comment: '是否默认地址:0-否 1-是',
    })
        isDefault: IS_DEFAULT;

    @CreateDateColumn({
        name: 'created_at',
        comment: '创建时间',
    })
        createdAt: Date;

    /** 关联客户 */
    @ManyToOne(() => Client)
    @JoinColumn({ name: 'client_id' })
        client: Client;
}
