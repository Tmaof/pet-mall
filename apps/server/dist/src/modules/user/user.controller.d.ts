import { CreateUserBatchDto } from './dto/create-user-batch.dto';
import { GetUserAllPagingDto, GetUserRoleDto } from './dto/get-user.dto';
import { UserService } from './user.service';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUser(req: any): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: {
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
        };
        message: string;
        code: number;
        success: boolean;
    }>>;
    getUsersPaging(query: GetUserAllPagingDto): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: {
            list: import("./user.entity").User[];
            total: number;
            page: number;
            size: number;
        };
        message: string;
        code: number;
        success: boolean;
    }>>;
    getUsers(): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: import("./dto-res/get.dto").FindAllExcelResDto;
        message: string;
        code: number;
        success: boolean;
    }>>;
    getUserRole(dto: GetUserRoleDto): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: {
            role: import("../role/role.entity").Role[];
        };
        message: string;
        code: number;
        success: boolean;
    }>>;
    addUserBatch(dto: CreateUserBatchDto): Promise<{
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
    updateUserRole(dto: UpdateUserRoleDto): Promise<{
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
    removeUser(userId: number): Promise<{
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
