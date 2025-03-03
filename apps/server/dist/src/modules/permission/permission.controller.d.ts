import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
export declare class PermissionController {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    addPermission(dto: CreatePermissionDto): {
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: unknown;
        message: string;
        code: number;
        success: boolean;
    }>;
    getPermissionList(): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: import("./dto-res/get.dto").GetPermissionListItem[];
        message: string;
        code: number;
        success: boolean;
    }>>;
    deletePermission(permissionId: number): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: unknown;
        message: string;
        code: number;
        success: boolean;
    }>>;
}
