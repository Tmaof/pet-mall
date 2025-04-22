import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Client } from '../client.entity';
import { ClientStatus } from '../enum';
import { QueryClientListDto } from '../req-dto';
import { ClientListDto } from '../res-dto';

/**
 * 后台客户管理服务
 */
@Injectable()
export class AdminClientService {
    constructor (@InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,) {}

    /**
     * 获取客户列表
     */
    async getClientList (query: QueryClientListDto): Promise<ClientListDto> {
        const { id, clientname, gender, status, startTime, endTime, page = 1, pageSize = 10 } = query;

        const queryBuilder = this.clientRepository.createQueryBuilder('client');

        if (id) {
            queryBuilder.andWhere('client.id = :id', { id });
        }

        if (clientname) {
            queryBuilder.andWhere('client.clientname LIKE :clientname', { clientname: `%${clientname}%` });
        }

        if (gender !== undefined) {
            queryBuilder.andWhere('client.gender = :gender', { gender });
        }

        if (status !== undefined) {
            queryBuilder.andWhere('client.status = :status', { status });
        }

        if (startTime) {
            queryBuilder.andWhere('client.openTime >= :startTime', { startTime });
        }

        if (endTime) {
            queryBuilder.andWhere('client.openTime <= :endTime', { endTime });
        }

        const [list, total] = await queryBuilder
            .skip((page - 1) * pageSize)
            .take(pageSize)
            .orderBy('client.openTime', 'DESC')
            .getManyAndCount();

        return {
            list,
            total,
            page,
            pageSize,
        };
    }

    /**
     * 禁用客户
     */
    async disableClient (id: number): Promise<void> {
        const client = await this.clientRepository.findOne({ where: { id } });

        if (!client) {
            throw new Error('客户不存在');
        }

        client.status = ClientStatus.DISABLE;
        await this.clientRepository.save(client);
    }

    /**
     * 启用客户
     */
    async enableClient (id: number): Promise<void> {
        const client = await this.clientRepository.findOne({ where: { id } });

        if (!client) {
            throw new Error('客户不存在');
        }

        client.status = ClientStatus.ENABLE;
        await this.clientRepository.save(client);
    }
}
