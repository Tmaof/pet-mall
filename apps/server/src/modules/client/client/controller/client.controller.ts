import { ReqUser } from '@/decorator/index.decorator';
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
import { UpdateClientDto, UpdatePasswordDto } from '../req-dto';
import { ClientService } from '../service/client.service';


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

    /** 更新密码 */
    @Post('password')
    async updatePassword (
    @ReqUser('clientId') clientId: number,
        @Body() dto: UpdatePasswordDto,
    ) {
        const data = await this.clientService.updatePassword(clientId, dto);
        return getCommonRes(data);
    }

    /** 注销用户 */
    // @Delete('/info')
    // async removeClient (@Param('clientId') clientId: number) {
    //     const data = await this.clientService.remove(clientId);
    //     return getCommonRes(data);
    // }
}
