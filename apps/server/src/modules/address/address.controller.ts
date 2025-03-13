import { Public } from '@/decorator/index.decorator';
import { Controller, Get } from '@nestjs/common';
import { AddressService } from './address.service';
import { getCommonRes } from '@/utils';

@Controller('address')
export class AddressController {
    constructor (private readonly addressService: AddressService) {}

    /**
     * 获取3级行政区划列表：省份、市、县
     */
    @Public()
    @Get('tree')
    async getRegionTree () {
        // const data = await this.addressService.getRegionTree();
        const data = await this.addressService.getRegionTreeByFile();
        return getCommonRes({ data });
    }
}
