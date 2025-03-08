import { JwtPayloadParsed } from '@/modules/jwt/types';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { Client } from './client.entity';
import { CreateClientDto, UpdateClientDto } from './req-dto';

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
        // console.log('jwtPayload', jwtPayload);
        if (!('clientId' in jwtPayload)) {
            throw new Error('非客户用户');
        }
        const { password, ...rest } = dto;
        const client = await this.clientRepository.findOne({ where: { id: jwtPayload.clientId } });
        if (!client) {
            throw new Error('客户不存在');
        }
        // 判断客户名是否存在
        if (rest.clientname) {
            const clientTmp = await this.findByClientname(rest.clientname);
            if (clientTmp) {
                throw new Error('客户名已存在');
            }
        }

        Object.assign(client, rest);
        if (password) {
            client.password = await argon2.hash(password);
        }
        const res = await this.clientRepository.save(client);
        return res;
    }
}
