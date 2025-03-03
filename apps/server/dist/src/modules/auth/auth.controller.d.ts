import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signin(dto: SigninUserDto): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: {
            token: string;
        };
        message: string;
        code: number;
        success: boolean;
    }>>;
    signup(dto: SigninUserDto): Promise<{
        data: {};
        message: string;
        code: import("../../enum").ResCodeEnum;
        success: boolean;
    } & Partial<{
        [key: string]: any;
        data: import("../user/user.entity").User;
        message: string;
        code: number;
        success: boolean;
    }>>;
    logout(req: any): Promise<{
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
