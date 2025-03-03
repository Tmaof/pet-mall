import { UserLog } from '../user-log.entity';
export declare class CreateUserLogDto {
    userId: number;
    logInfo: Partial<UserLog>;
}
