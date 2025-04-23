import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { PermGuard } from '@/guards/perm.guard';
import { getCommonRes } from '@/utils';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(JwtGuard, PermGuard)
@setNeedPerm(permTree.userPublic)
export class DashboardController {
    constructor (private readonly dashboardService: DashboardService) {}

    /**
     * 获取仪表盘数据
     * @param dto 请求参数
     */
    @Get()
    async getDashboardData () {
        const data = await this.dashboardService.getDashboardData();
        return getCommonRes({ data });
    }
}
