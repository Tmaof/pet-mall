import { UserLogService } from './user-log.service';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';
import { DeleteUserLogByTimeRangeDto } from './dto-req/delete.dto';
export declare class UserLogController {
    private userLogService;
    constructor(userLogService: UserLogService);
    getUsersPaging(query: GetUserLogAllPagingDto): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: {
            list: import("./user-log.entity").UserLog[];
            total: number;
            page: number;
            size: number;
        };
        message: string;
        code: number;
        success: boolean;
    }>>;
    deleteUserlogByTimeRange(dto: DeleteUserLogByTimeRangeDto): Promise<{
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
