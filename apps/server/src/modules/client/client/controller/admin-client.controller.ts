import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    ClassSerializerInterceptor, Controller, Get, Post, Query,
    UseGuards, UseInterceptors
} from '@nestjs/common';
import { QueryClientListDto } from '../req-dto';
import { AdminClientService } from '../service/admin-client.service';

/**
 * 后台客户管理
 */
@Controller('admin-client')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class AdminClientController {
    constructor (private clientService: AdminClientService) {}

    /**
     * 获取客户列表
     */
    @Get('list')
    async getClientList (@Query() query: QueryClientListDto) {
        const data = await this.clientService.getClientList(query);
        return getCommonRes({ data });
    }

    /**
     * 禁用客户
     */
    @Post('disable')
    async disableClient (@Body('id') id: number) {
        await this.clientService.disableClient(id);
        return getCommonRes();
    }

    /**
     * 启用客户
     */
    @Post('enable')
    async enableClient (@Body('id') id: number) {
        await this.clientService.enableClient(id);
        return getCommonRes();
    }
}
