import { IS_PUBLIC_KEY } from '@/constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtGuard 守卫
 * @description
 * Guard 寻找名为 'jwt' 的策略（export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {  // 显式指定 'jwt'）
 * 校验jwt合法性，有效性；
 * 如果没有 jwt ，则返回 401 错误；
 * 如果有，则构建一个user对象，附加到请求对象 req 上。
 */
@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
    constructor (private reflector: Reflector) {
        super();
    }

    /** */
    async canActivate (context: ExecutionContext): Promise<boolean> {
        // 判断该路由是否需要跳过认证
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        // 如果需要认证，则继续认证
        const parentCanActivate = (await super.canActivate(context)) as boolean;
        return parentCanActivate;
    }
}


