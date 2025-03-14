import { ClientService } from '@/modules/client/client/service/client.service';
import { MyJwtService } from '@/modules/jwt/jwt.service';
import { ClientJwtPayloadInfo, JwtPayloadParsed } from '@/modules/jwt/types';
import { ForbiddenException, Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class ClientAuthService {
    // 用一个 Set 来存储已经退出登录的 token
    private invalidatedTokens = new Set<string>();

    constructor (private clientService: ClientService, private jwt: MyJwtService) {}

    /** 登录 */
    async signin (clientname: string, password: string) {
        const client = await this.clientService.findByClientname(clientname);

        if (!client) {
            throw new ForbiddenException('客户不存在，请注册');
        }

        // 客户密码进行比对
        const isPasswordValid = await argon2.verify(client.password, password);

        if (!isPasswordValid) {
            throw new ForbiddenException('客户名或者密码错误');
        }

        const payload = {
            clientname: client.clientname,
            clientId: client.id,
        } as ClientJwtPayloadInfo;

        return await this.jwt.signAsync(payload);
    }

    /** 注册 */
    async signup (clientname: string, password: string) {
        const client = await this.clientService.findByClientname(clientname);

        if (client) {
            throw new ForbiddenException('客户已存在');
        }

        const res = await this.clientService.create({
            clientname,
            password,
        });

        return res;
    }

    /** 退出登录 */
    async logout (payloadInfo: JwtPayloadParsed) {
        if (!('clientId' in payloadInfo)) {
            throw new ForbiddenException('非客户客户');
        }
        const { token } = payloadInfo;
        // 将客户 token 添加到已退出登录的集合中
        this.invalidatedTokens.add(token);
        return true;
    }

    /** 验证 token 是否有效 */
    validateToken (token: string): boolean {
        return !this.invalidatedTokens.has(token);
    }
}
