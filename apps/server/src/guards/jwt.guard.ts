import { IS_PUBLIC_KEY } from '@/constant';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ExtractJwt } from 'passport-jwt';

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


/**
 *  JwtGuard 守卫
 * @description
 * 当请求中没有token时 不抛出401的错误。
 * 有些场景下，比如获取评论列表(如果有token可以拿到用户信息更好，没有也可以)，可以不抛出错误，让请求继续
 */
@Injectable()
export class JwtGuardLoose extends AuthGuard('jwt') {
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

        const req = context.switchToHttp().getRequest();
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
        if (!token) {
            return true;
        }

        // 如果需要认证，则继续认证
        const parentCanActivate = (await super.canActivate(context)) as boolean;
        return parentCanActivate;
    }
}
