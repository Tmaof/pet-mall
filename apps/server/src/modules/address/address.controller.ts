import { Public } from '@/decorator/index.decorator';
import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
    constructor (private readonly addressService: AddressService) {}

    /**
     * 获取3级行政区划列表：省份、市、县
     */
    @Public()
    @Get('tree')
    async getRegionTree () {
        return await this.addressService.getRegionTree();
    }
}
