import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ comment: '性别', default: 0, type: 'tinyint' })
        gender: number;

    @Column({ comment: '邮箱' })
        email: string;

    @Column({ comment: '联系电话' })
        phone: string;

    @Column({ comment: '状态，0-禁用 1-启用', default: 1, type: 'tinyint' })
        status: number;
}
