import { ClientAuthModule } from '@/modules/client/auth/auth.module';
import { UserAuthModule } from '@/modules/staff/auth/auth.module';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ConfigEnum } from 'config/env/config.enum';
import { MyJwtService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';

@Global()
@Module({
    imports: [
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: async (cs: ConfigService) => {
                // console.log('JWT_SECRET',  cs.get(ConfigEnum.JWT_SECRET));
                return {
                    secret: cs.get<string>(ConfigEnum.JWT_SECRET),
                    signOptions: { expiresIn: cs.get<string>(ConfigEnum.JWT_EXPIRES_IN) },
                };
            },

        }),
        ClientAuthModule,
        UserAuthModule,
    ],
    providers: [JwtStrategy, MyJwtService],
    controllers: [],
    exports: [JwtStrategy, MyJwtService],
})

export class MyJwtModule {}
