import { IS_PUBLIC_KEY, NEED_PERMISSION_CODE } from '@/constant';
import { PermissionInfo } from '@/constant/permCode';
import { JwtPayloadParsed, JwtPayloadParsedKey } from '@/modules/jwt/types';
import { createParamDecorator, ExecutionContext, SetMetadata, UnauthorizedException } from '@nestjs/common';

/**
 * 创建了一个Public装饰器，它使用SetMetadata函数将IS_PUBLIC_KEY设置为true。
 * 接下来，你可以在需要标记为公共的路由处理函数上使用@Public装饰器，
 * 这意味着这个路由是公共的，不需要身份验证即可访问。
 * ps: 需要在JwtGuard中检查isPublic元数据。
 * @returns
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);


/**
 * 用于为 控制器，路由 标记需要其需要的权限
 * @returns
 */
export const setNeedPerm = (perm:PermissionInfo) => {
    return  SetMetadata(NEED_PERMISSION_CODE, perm);
};


type ReqUserParams = { key: JwtPayloadParsedKey, isThrow?: boolean } | string;
type ReqUserOpt = { key: JwtPayloadParsedKey, isThrow?: boolean }

/**
 * 定义 HTTP 路由参数装饰器。
 * 获取请求用户信息
 * @param key 获取用户信息中的某个属性
 * @param isThrow 如果没有获取到用户信息 是否抛出异常，默认是true
 * @returns
 */
export const ReqUser = createParamDecorator((params: ReqUserParams, ctx: ExecutionContext) => {
    let opt = {} as ReqUserOpt;
    if (typeof params === 'string') {
        opt = { key: params as JwtPayloadParsedKey, isThrow: true };
    } else if (typeof params === 'object' && params !== null) {
        opt = params;
    } else {
        throw new Error('参数错误');
    }

    const { key, isThrow = true } = opt;
    if (!key) return;
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayloadParsed;
    if (!user || user[key] === undefined) {
        if (isThrow) throw new UnauthorizedException('用户信息不存在');
        return undefined;
    }
    return user[key];
},);

