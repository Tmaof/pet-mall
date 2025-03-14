import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ClientGender, ClientStatus } from './enum';

@Entity('client')
export class Client {
    @PrimaryGeneratedColumn({ comment: '客户ID，主键' })
        id: number;

    @Column({ unique: true, comment: '客户名' })
        clientname: string;

    @Column({ comment: '密码' })
    @Exclude() // 返回时排除密码
        password: string;

    @Column({ type: 'datetime', comment: '开通时间', default: () => 'CURRENT_TIMESTAMP' })
        openTime: Date;

    @Column({ comment: '头像URL', default: '' })
        avatar: string;

    @Column({ comment: '简介', default: '', nullable: true })
        introduction: string;

    @Column({ comment: '性别', default: ClientGender.UNKNOWN, type: 'enum', enum: ClientGender })
        gender: ClientGender;

    @Column({ comment: '邮箱', default: '' })
        email: string;

    @Column({ comment: '联系电话', default: '' })
        phone: string;

    @Column({ comment: '状态', default: ClientStatus.ENABLE, type: 'enum', enum: ClientStatus })
        status: ClientStatus;
}
