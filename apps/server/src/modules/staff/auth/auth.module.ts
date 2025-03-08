import { UserModule } from '@/modules/staff/user/user.module';
import { Module } from '@nestjs/common';
import { UserAuthController } from './auth.controller';
import { UserAuthService } from './auth.service';


@Module({
    imports: [
        UserModule,
    ],
    providers: [UserAuthService],
    controllers: [UserAuthController],
    exports: [UserAuthService],
})

export class UserAuthModule {}
