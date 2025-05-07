import { ConfigEnum } from '@/config/env/config.enum';
import { ClientAuthService } from '@/modules/client/auth/auth.service';
import { UserAuthService } from '@/modules/staff/auth/auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayloadInfo, JwtPayloadParsed } from './types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor (
        protected cs: ConfigService,
        /** 员工认证服务 */
        private userAuthService: UserAuthService,
        /** 客户认证服务 */
        private clientAuthService: ClientAuthService
    ) {
        // console.log('JWT_SECRET', cs.get(ConfigEnum.JWT_SECRET));
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: cs.get<string>(ConfigEnum.JWT_SECRET),
            // 注意点: 如果为true，则validate方法的第一个参数为request对象，第二个参数为payload
            passReqToCallback: true,
        });
    }

    /**
     * Passport将基于validate()方法的返回值构建一个user对象，
     * 并将其作为属性附加到请求对象上 req.user。
     */
    async validate (req: Request, payload: JwtPayloadInfo) {
        // 获取 token
        const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

        // 验证 token 是否已经退出登录
        if ('userId' in payload) {
            const isValid = this.userAuthService.validateToken(token);
            if (!isValid) {
                throw new UnauthorizedException('token已失效，请重新登录');
            }
        } else if ('clientId' in payload) {
            const isValid = this.clientAuthService.validateToken(token);
            if (!isValid) {
                throw new UnauthorizedException('token已失效，请重新登录');
            }
        }


        let res: JwtPayloadParsed = null;
        if ('userId' in payload) {
            res = { token, username: payload.username, userId: payload.userId };
        } else if ('clientId' in payload) {
            res = { token, clientname: payload.clientname, clientId: payload.clientId };
        }
        return res;
    }
}
