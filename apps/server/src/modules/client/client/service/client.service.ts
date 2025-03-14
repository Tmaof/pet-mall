import { JwtPayloadParsed } from '@/modules/jwt/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { Client } from '../client.entity';
import { CreateClientDto, UpdateClientDto, UpdatePasswordDto } from '../req-dto';

@Injectable()
export class ClientService {
    constructor (@InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,) {}

    /** 新增客户 */
    async create (client: CreateClientDto) {
        const clientTmp = this.clientRepository.create(client);
        // console.log('userTmp', userTmp);
        // 对用户密码使用argon2加密
        clientTmp.password = await argon2.hash(clientTmp.password);
        const res = await this.clientRepository.save(clientTmp);
        return res;
    }

    /** 根据客户名查询 */
    findByClientname (clientname: string) {
        return this.clientRepository.findOne({ where: { clientname } });
    }

    /** 获取当前客户的信息 */
    async getCurrentClient (jwtPayload:JwtPayloadParsed) {
        // console.log('jwtPayload', jwtPayload);
        if (!('clientId' in jwtPayload)) {
            throw new Error('非客户用户');
        }
        const client = await this.clientRepository.findOne({ where: { id: jwtPayload.clientId } });

        if (!client) {
            throw new Error('客户不存在');
        }
        return client;
    }

    /** 更新当前客户信息 */
    async updateCurrentClient (jwtPayload: JwtPayloadParsed, dto: UpdateClientDto) {
        if (!dto || Object.keys(dto).length === 0) {
            throw new Error('更新信息不能为空');
        }
        if (!('clientId' in jwtPayload)) {
            throw new Error('非客户用户');
        }
        const client = await this.clientRepository.findOne({ where: { id: jwtPayload.clientId } });
        if (!client) {
            throw new Error('客户不存在');
        }
        // 判断客户名是否存在
        if (dto.clientname) {
            const clientTmp = await this.findByClientname(dto.clientname);
            if (clientTmp) {
                throw new Error('客户名已存在');
            }
        }

        Object.assign(client, dto);

        const res = await this.clientRepository.save(client);
        return res;
    }

    /** 更新密码 */
    async updatePassword (clientId: number, dto: UpdatePasswordDto) {
        const client = await this.clientRepository.findOne({ where: { id: clientId } });
        if (!client) {
            throw new Error('客户不存在');
        }
        // 判断旧密码是否正确
        const isPasswordCorrect = await argon2.verify(client.password, dto.oldPassword);
        if (!isPasswordCorrect) {
            throw new Error('旧密码错误');
        }
        // 更新密码
        client.password = await argon2.hash(dto.newPassword);
        const res = await this.clientRepository.save(client);
        return res;
    }
}
