import { User } from '@/modules/user/user.entity';
export declare class UserLog {
    id: number;
    path: string;
    methods: string;
    reqHeader: string;
    reqBody: string;
    reqQuery: string;
    reqParams: string;
    resBody: string;
    ip: string;
    time: Date;
    handeTime: number;
    user: User;
}
