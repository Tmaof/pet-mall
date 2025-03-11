import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Address } from './address.entity';
import { ADDRESS_CONSTANTS } from './constants';
import { IS_DEFAULT } from './enum';
import { CreateAddressDto } from './req-dto';
import { AddressDto, AddressListDto } from './res-dto';

@Injectable()
export class ClientAddressService {
    constructor (@InjectRepository(Address)
    private addressRepository: Repository<Address>,) {}

    /**
   * 创建地址
   * @param clientId 客户ID
   * @param createAddressDto 创建地址DTO
   */
    async create (clientId: number, createAddressDto: CreateAddressDto): Promise<void> {
        // 检查地址数量是否超出限制
        const count = await this.addressRepository.count({ where: { clientId } });
        if (count >= ADDRESS_CONSTANTS.MAX_ADDRESS_COUNT) {
            throw new Error(`地址数量不能超过${ADDRESS_CONSTANTS.MAX_ADDRESS_COUNT}个`);
        }

        // 如果设置为默认地址,需要将其他地址设置为非默认
        if (createAddressDto.isDefault === IS_DEFAULT.YES && count > 0) {
            await this.addressRepository.update(
                { clientId },
                { isDefault: IS_DEFAULT.NO },
            );
        }

        // 如果是第一个地址,自动设置为默认地址
        if (count === 0) {
            createAddressDto.isDefault = IS_DEFAULT.YES;
        }

        // 创建地址
        const address = this.addressRepository.create({
            ...createAddressDto,
            clientId,
        });
        await this.addressRepository.save(address);
    }

    /**
   * 更新地址
   * @param clientId 客户ID
   * @param id 地址ID
   * @param updateAddressDto 更新地址DTO
   */
    async update (clientId: number, id: number, updateAddressDto: CreateAddressDto): Promise<void> {
        const address = await this.addressRepository.findOne({ where: { id, clientId } });

        if (!address) {
            throw new Error('地址不存在');
        }

        // 如果设置为默认地址,需要将其他地址设置为非默认
        if (updateAddressDto.isDefault === IS_DEFAULT.YES && address.isDefault === IS_DEFAULT.NO) {
            await this.addressRepository.update(
                { clientId },
                { isDefault: IS_DEFAULT.NO },
            );
        }

        // 更新地址
        await this.addressRepository.update(id, updateAddressDto);
    }

    /**
   * 删除地址
   * @param clientId 客户ID
   * @param id 地址ID
   */
    async remove (clientId: number, id: number): Promise<void> {
        const address = await this.addressRepository.findOne({ where: { id, clientId } });

        if (!address) {
            throw new Error('地址不存在');
        }

        // 如果删除的是默认地址,需要将第一个地址设置为默认地址
        if (address.isDefault === IS_DEFAULT.YES) {
            const firstAddress = await this.addressRepository.findOne({ where: { clientId, id: Not(id) } });
            if (firstAddress) {
                await this.addressRepository.update(firstAddress.id, { isDefault: IS_DEFAULT.YES });
            }
        }

        await this.addressRepository.remove(address);
    }

    /**
   * 获取地址列表
   * @param clientId 客户ID
   */
    async findAll (clientId: number): Promise<AddressListDto> {
        const list = await this.addressRepository.find({
            where: { clientId },
            order: {
                isDefault: 'DESC',
                createdAt: 'DESC',
            },
        });

        return { list };
    }

    /**
   * 获取地址详情
   * @param clientId 客户ID
   * @param id 地址ID
   */
    async findOne (clientId: number, id: number): Promise<AddressDto> {
        const address = await this.addressRepository.findOne({ where: { id, clientId } });

        if (!address) {
            throw new Error('地址不存在');
        }

        return address;
    }

    /**
   * 设置默认地址
   * @param clientId 客户ID
   * @param id 地址ID
   */
    async setDefault (clientId: number, id: number): Promise<void> {
        const address = await this.addressRepository.findOne({ where: { id, clientId } });

        if (!address) {
            throw new Error('地址不存在');
        }

        // 将其他地址设置为非默认
        await this.addressRepository.update(
            { clientId },
            { isDefault: IS_DEFAULT.NO },
        );

        // 设置当前地址为默认
        await this.addressRepository.update(id, { isDefault: IS_DEFAULT.YES });
    }
}
