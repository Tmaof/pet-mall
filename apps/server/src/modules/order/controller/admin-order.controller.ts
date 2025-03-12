import { permTree } from '@/constant/permCode';
import { setNeedPerm } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { PermGuard } from '@/guards/perm.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    Controller,
    Get,
    Param,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { QueryOrderDto, UpdateOrderStatusDto } from '../req-dto';
import { OrderService } from '../service/order.service';

@Controller('admin/order')
@UseGuards(JwtGuard, PermGuard)
@setNeedPerm(permTree.orderManage)
export class AdminOrderController {
    constructor (private readonly orderService: OrderService) {}

    /**
     * 管理员获取所有订单
     */
    @Get()
    async findAll (@Query() query: QueryOrderDto) {
        // 管理员查询不需要clientId过滤
        const data = await this.orderService.findAll(null, query);
        return getCommonRes({ data });
    }

    /**
     * 管理员获取订单详情
     */
    @Get(':id')
    async findOne (@Param('id') id: string) {
        // 管理员查询不需要clientId过滤
        const data = await this.orderService.findOne(null, +id);
        return getCommonRes({ data });
    }

    /**
     * 管理员更新订单状态
     */
    @Put(':id/status')
    async updateStatus (
    @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto
    ) {
        const data = await this.orderService.adminUpdateStatus(+id, updateOrderStatusDto);
        return getCommonRes({ data });
    }
}
