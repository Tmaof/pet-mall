import { RolesService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
export declare class RolesController {
    private readonly rolesService;
    constructor(rolesService: RolesService);
    getRoleList(): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: import("./dto-res/get.dto").GetRoleListDto;
        message: string;
        code: number;
        success: boolean;
    }>>;
    getRolePermission(roleId: number): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: import("./dto-res/get.dto").GetRolePermissionsDto;
        message: string;
        code: number;
        success: boolean;
    }>>;
    addRole(dto: CreateRoleDto): {
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
    updateRolePermission(dto: UpdateRolePermissionDto): Promise<{
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
    deleteRole(roleId: number): Promise<{
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
