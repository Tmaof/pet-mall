import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtGuard 守卫
 * @description
 * Guard 寻找名为 'jwt' 的策略（export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {  // 显式指定 'jwt'）
 * 校验jwt合法性，有效性；
 * 如果没有 jwt ，则返回 401 错误；
 * 如果有，则构建一个user对象，附加到请求对象 req 上。
 */
export class JwtGuard extends AuthGuard('jwt') {
    constructor () {
        super();
    }

    /** */
    async canActivate (context: ExecutionContext): Promise<boolean> {
        const parentCanActivate = (await super.canActivate(context)) as boolean;
        return parentCanActivate;
    }
}


