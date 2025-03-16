import { ReqUser } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    UseGuards
} from '@nestjs/common';
import { CreateOrderDto, QueryOrderDto, UpdateOrderStatusByClientDto } from '../req-dto';
import { ClientOrderService } from '../service/client-order.service';

@Controller('order')
@UseGuards(JwtGuard)
export class OrderController {
    constructor (private readonly orderService: ClientOrderService) {}

    /**
     * 创建订单
     */
    @Post()
    async create (
    @ReqUser('clientId') clientId: number,
        @Body() createOrderDto: CreateOrderDto
    ) {
        const data = await this.orderService.create(clientId, createOrderDto);
        return getCommonRes({ data });
    }

    /**
     * 获取订单列表
     */
    @Get()
    async findAll (
    @ReqUser('clientId') clientId: number,
        @Query() query: QueryOrderDto
    ) {
        const data = await this.orderService.findAll(clientId, query);
        return getCommonRes({ data });
    }

    /**
     * 获取订单详情
     */
    @Get(':id')
    async findOne (
    @ReqUser('clientId') clientId: number,
        @Param('id') id: string
    ) {
        const data = await this.orderService.findOne(clientId, +id);
        return getCommonRes({ data });
    }

    /**
     * 更新订单状态
     */
    @Put(':id/status')
    async updateStatus (
    @ReqUser('clientId') clientId: number,
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusByClientDto
    ) {
        const data = await this.orderService.updateStatus(clientId, +id, updateOrderStatusDto);
        return getCommonRes({ data });
    }

    /**
     * 取消订单
     */
    @Put(':id/cancel')
    async cancelOrder (
    @ReqUser('clientId') clientId: number,
        @Param('id') id: string
    ) {
        const data = await this.orderService.cancelOrder(clientId, +id);
        return getCommonRes({ data });
    }
}
