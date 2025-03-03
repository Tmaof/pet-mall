import { Repository } from 'typeorm';
import { UserLog } from './user-log.entity';
import { CreateUserLogDto } from './dto-req/post.dto';
import { UserService } from '../user/user.service';
import { GetUserLogAllPagingDto } from './dto-req/get.dto';
import { DeleteUserLogByTimeRangeDto } from './dto-req/delete.dto';
export declare class UserLogService {
    private userLogRepository;
    private userService;
    constructor(userLogRepository: Repository<UserLog>, userService: UserService);
    create(dto: CreateUserLogDto): Promise<{
        message: string;
        data?: undefined;
    } | {
        message: string;
        data: UserLog;
    }>;
    recordUserLog(request: any, data: any, startTime: number): Promise<void>;
    findAllPaging(dto: GetUserLogAllPagingDto): Promise<{
        list: UserLog[];
        total: number;
        page: number;
        size: number;
    }>;
    deleteUserlogByTimeRange(dto: DeleteUserLogByTimeRangeDto): Promise<{
        message: string;
    }>;
}
