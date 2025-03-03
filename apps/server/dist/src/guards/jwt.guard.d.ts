import { ExecutionContext } from '@nestjs/common';
declare const JwtGuard_base: import("@nestjs/passport").Type<import("@nestjs/passport").IAuthGuard>;
export declare class JwtGuard extends JwtGuard_base {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
export {};
