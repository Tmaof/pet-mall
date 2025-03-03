import { Role } from '@/modules/role/role.entity';
import { UserLog } from '@/modules/user-log/user-log.entity';
export declare class User {
    id: number;
    username: string;
    password: string;
    openTime: Date;
    avatar: string;
    gender: number;
    role: Role[];
    log: UserLog[];
    constructor(user: Partial<User>);
}
