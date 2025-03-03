import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { Role } from '../role/role.entity';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
import { JwtPayloadParsed } from '../auth/types';
import { Permission } from '../permission/permission.entity';
import { GetUserAllPagingDto, GetUserRoleDto } from './dto/get-user.dto';
import { FindAllExcelResDto } from './dto-res/get.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly roleRepository;
    private readonly permissionRepository;
    constructor(userRepository: Repository<User>, roleRepository: Repository<Role>, permissionRepository: Repository<Permission>);
    getCurrentUser(jwtPayload: JwtPayloadParsed): Promise<{
        role: any[];
        permission: {
            menus: string[];
            points: string[];
        };
        id: number;
        username: string;
        password: string;
        openTime: Date;
        avatar: string;
        gender: number;
        log: import("../user-log/user-log.entity").UserLog[];
    } | {
        message: string;
    }>;
    getUserPermCode(userId: number): Promise<Set<string>>;
    findAllPaging(dto: GetUserAllPagingDto): Promise<{
        list: User[];
        total: number;
        page: number;
        size: number;
    }>;
    findAllExcel(): Promise<FindAllExcelResDto>;
    findUserRole(dto: GetUserRoleDto): Promise<{
        role: Role[];
    }>;
    findByUsername(username: string): Promise<User>;
    findOne(userId: number): Promise<User>;
    create(user: Partial<User>): Promise<User>;
    createBatch({ payload }: CreateUserBatchDto): Promise<{
        message: string;
    }>;
    updateUserRole(dto: UpdateUserRoleDto): Promise<{
        message: string;
    }>;
    update(): void;
    remove(userId: number): Promise<{
        message: string;
    }>;
}
