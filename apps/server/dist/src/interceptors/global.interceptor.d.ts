import { UserLogService } from '@/modules/staff/user-log/user-log.service';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class GlobalInterceptor implements NestInterceptor {
    protected userLogService: UserLogService;
    constructor(userLogService: UserLogService);
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
