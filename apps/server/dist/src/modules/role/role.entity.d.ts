import { Permission } from '@/modules/permission/permission.entity';
import { User } from '@/modules/user/user.entity';
export declare class Role {
    id: number;
    name: string;
    describe: string;
    user: User[];
    permission: Permission[];
}
