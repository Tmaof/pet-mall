import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Post,
    Req,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common';
import { ClientAuthService } from './auth.service';
import { SigninClientDto } from './req-dto';

@Controller('client-auth')
@UseInterceptors(ClassSerializerInterceptor)
export class ClientAuthController {
    constructor (private authService: ClientAuthService,) {}

    /** 登录 */
    @Post('/signin')
    async signin (@Body() dto: SigninClientDto) {
        const { clientname, password } = dto;
        const token = await this.authService.signin(clientname, password);
        return getCommonRes({ data: { token } });
    }

    /** 注册 */
    @Post('/signup')
    async signup (@Body() dto: SigninClientDto) {
        const { clientname, password } = dto;
        const data = await this.authService.signup(clientname, password);
        return getCommonRes({ data });
    }

    /** 退出登录 */
    @Post('/logout')
    @UseGuards(JwtGuard)
    async logout (@Req() req) {
        await this.authService.logout(req.user);
        return getCommonRes({ message: '退出登录成功' });
    }
}
