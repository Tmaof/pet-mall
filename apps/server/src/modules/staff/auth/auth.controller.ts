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
import { UserAuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';


@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class UserAuthController {
    constructor (private authService: UserAuthService,) {}

    /** 登录 */
    @Post('/signin')
    async signin (@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        const token = await this.authService.signin(username, password);
        return getCommonRes({ data: { token } });
    }

    /** 注册 */
    @Post('/signup')
    async signup (@Body() dto: SigninUserDto) {
        const { username, password } = dto;
        const data = await this.authService.signup(username, password);
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
