import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { UpdateClientDto } from './req-dto';


@Controller('client')
@UseGuards(JwtGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class ClientController {
    constructor (private clientService: ClientService,) {
    }

    /** 获取当前用户的信息 */
    @Get('/info')
    async getCurrentClient (@Req() req) {
        const data = await this.clientService.getCurrentClient(req.user);
        return getCommonRes({ data });
    }

    /** 更新信息 */
    @Post('info')
    async updateClientRole (
    @Req() req,
        @Body() dto: UpdateClientDto,
    ) {
        const data = await this.clientService.updateCurrentClient(req.user, dto);
        return getCommonRes(data);
    }

    /** 注销用户 */
    // @Delete('/info')
    // async removeClient (@Param('clientId') clientId: number) {
    //     const data = await this.clientService.remove(clientId);
    //     return getCommonRes(data);
    // }
}
