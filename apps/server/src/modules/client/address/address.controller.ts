import { ReqUser } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { ClientAddressService } from './address.service';
import { CreateAddressDto, UpdateAddressDto } from './req-dto';

@Controller('client/address')
@UseGuards(JwtGuard)
export class ClientAddressController {
    constructor (private readonly addressService: ClientAddressService) {}

    /**
   * 创建地址
   */
    @Post()
    async create (@ReqUser('clientId') clientId: number, @Body() createAddressDto: CreateAddressDto) {
        const data = await this.addressService.create(clientId, createAddressDto);
        return getCommonRes({ data });
    }

    /**
   * 更新地址
   */
    @Put(':id')
    async update (
    @ReqUser('clientId') clientId: number,
        @Param('id') id: string,
        @Body() updateAddressDto: UpdateAddressDto,
    ) {
        const data = await this.addressService.update(clientId, +id, updateAddressDto);
        return getCommonRes({ data });
    }

    /**
   * 删除地址
   */
    @Delete(':id')
    async remove (@ReqUser('clientId') clientId: number, @Param('id') id: string) {
        await this.addressService.remove(clientId, +id);
        return getCommonRes();
    }

    /**
   * 获取地址列表
   */
    @Get()
    async findAll (@ReqUser('clientId') clientId: number) {
        const data = await this.addressService.findAll(clientId);
        return getCommonRes({ data });
    }

    /**
   * 获取地址详情
   */
    @Get(':id')
    async findOne (@ReqUser('clientId') clientId: number, @Param('id') id: string) {
        const data = await this.addressService.findOne(clientId, +id);
        return getCommonRes({ data });
    }

    /**
   * 设置默认地址
   */
    @Put(':id/default')
    async setDefault (@ReqUser('clientId') clientId: number, @Param('id') id: string) {
        await this.addressService.setDefault(clientId, +id);
        return getCommonRes();
    }
}
