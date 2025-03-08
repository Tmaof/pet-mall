import { MyJwtService } from '@/modules/jwt/jwt.service';
import { JwtPayloadParsed, UserJwtPayloadInfo } from '@/modules/jwt/types';
import { UserService } from '@/modules/staff/user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UserAuthService {
    // 用一个 Set 来存储已经退出登录的 token
    private invalidatedTokens = new Set<string>();

    constructor (
        private userService: UserService,
        private jwt: MyJwtService
    ) {}

    /** 登录 */
    async signin (username: string, password: string) {
        const user = await this.userService.findByUsername(username);

        if (!user) {
            throw new ForbiddenException('用户不存在，请注册');
        }

        // 用户密码进行比对
        const isPasswordValid = await argon2.verify(user.password, password);

        if (!isPasswordValid) {
            throw new ForbiddenException('用户名或者密码错误');
        }
        const payload = {
            username: user.username,
            userId: user.id,
        } as UserJwtPayloadInfo;
        return await this.jwt.signAsync(payload);
    }

    /** 注册 */
    async signup (username: string, password: string) {
        const user = await this.userService.findByUsername(username);

        if (user) {
            throw new ForbiddenException('用户已存在');
        }

        const res = await this.userService.create({
            username,
            password,
        });

        return res;
    }

    /** 退出登录 */
    async logout (payloadInfo: JwtPayloadParsed) {
        if (!('userId' in payloadInfo)) {
            throw new ForbiddenException('非员工用户');
        }
        const { token } = payloadInfo;
        // 将用户 token 添加到已退出登录的集合中
        this.invalidatedTokens.add(token);
        return true;
    }

    /** 验证 token 是否有效 */
    validateToken (token: string): boolean {
        return !this.invalidatedTokens.has(token);
    }
}
