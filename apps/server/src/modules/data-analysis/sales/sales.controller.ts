import { getCommonRes } from '@/utils';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SalesAnalysisReqDto } from './req-dto';
import { SalesService } from './sales.service';
import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { PermGuard } from '@/guards/perm.guard';

@Controller('sales-analysis')
@UseGuards(JwtGuard, PermGuard)
@setNeedPerm(permTree.userPublic)
export class SalesController {
    constructor (private readonly salesService: SalesService) {}

    /**
     * 获取销售分析数据
     */
    @Get('')
    async getSalesAnalysis (@Query() dto: SalesAnalysisReqDto) {
        const data = await this.salesService.getSalesAnalysis(dto);
        return getCommonRes({ data });
    }
}
