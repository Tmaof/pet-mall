import { Role } from '@/modules/role/role.entity';
export declare class Permission {
    id: number;
    name: string;
    type: number;
    code: string;
    role: Role[];
    children: Permission[];
    parentPermission: Permission;
}
