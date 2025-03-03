import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { UpdateRolePermissionDto } from './dto/update-role-permission.dto';
import { Permission } from '../permission/permission.entity';
import { GetRoleListDto, GetRolePermissionsDto } from './dto-res/get.dto';
import { PermissionService } from '../permission/permission.service';
export declare class RolesService {
    private roleRepository;
    private permissionRepository;
    private permissionService;
    constructor(roleRepository: Repository<Role>, permissionRepository: Repository<Permission>, permissionService: PermissionService);
    getRoleList(): Promise<{
        data: GetRoleListDto;
    }>;
    getRolePermission(roleId: number): Promise<{
        message: string;
        data?: undefined;
    } | {
        data: GetRolePermissionsDto;
        message?: undefined;
    }>;
    create(dto: CreateRoleDto): Promise<Role>;
    updateRolePermission(dto: UpdateRolePermissionDto): Promise<{
        message: string;
    }>;
    delete(id: number): Promise<{
        message: string;
    }>;
}
