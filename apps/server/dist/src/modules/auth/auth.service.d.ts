import { UserService } from '@/modules/user/user.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private userService;
    private jwt;
    private invalidatedTokens;
    constructor(userService: UserService, jwt: JwtService);
    signin(username: string, password: string): Promise<string>;
    signup(username: string, password: string): Promise<import("../user/user.entity").User>;
    logout({ userId, token }: {
        userId: number;
        token: string;
    }): Promise<boolean>;
    validateToken(token: string): boolean;
}
