import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import type { UserLog } from 'server-modules/staff/user-log/user-log.entity'

export class DeleteUserLogByTimeRangeDto {
    @IsNotEmpty()
    @IsString()
        startDateStr: string;

    @IsNotEmpty()
    @IsString()
        endDateStr:string;
}



/** 创建 用户日志 dto */
export class CreateUserLogDto {
    userId: number;

    logInfo: Partial<UserLog>;
}