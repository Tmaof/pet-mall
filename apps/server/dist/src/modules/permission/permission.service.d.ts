import { CreatePermissionDto } from './dto/create-permission.dto';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { GetPermissionListItem } from './dto-res/get.dto';
import { ResCodeEnum } from '@/enum';
export declare class PermissionService {
    private permissionRepository;
    constructor(permissionRepository: Repository<Permission>);
    create(dto: CreatePermissionDto): Promise<Permission | {
        message: string;
    }>;
    getPermissionList(): Promise<{
        data: GetPermissionListItem[];
    }>;
    delete(permissionId: number): Promise<{
        message: string;
        success?: undefined;
        code?: undefined;
    } | {
        message: string;
        success: boolean;
        code: ResCodeEnum;
    }>;
}
