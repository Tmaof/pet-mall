import { PermissionInfo } from '@/constant/permCode';
export declare const Public: () => import("@nestjs/common").CustomDecorator<string>;
export declare const setNeedPerm: (perm: PermissionInfo) => import("@nestjs/common").CustomDecorator<string>;
