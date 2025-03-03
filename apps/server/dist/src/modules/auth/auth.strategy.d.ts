import { Strategy } from 'passport-jwt';
import { JwtPayloadInfo, JwtPayloadParsed } from './types';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    protected cs: ConfigService;
    private authService;
    constructor(cs: ConfigService, authService: AuthService);
    validate(req: Request, payload: JwtPayloadInfo): Promise<JwtPayloadParsed>;
}
export {};
