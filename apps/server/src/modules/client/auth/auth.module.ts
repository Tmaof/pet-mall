import { ClientModule } from '@/modules/client/client/client.module';
import { Module } from '@nestjs/common';
import { ClientAuthController } from './auth.controller';
import { ClientAuthService } from './auth.service';

@Module({
    imports: [
        ClientModule,
    ],
    providers: [ClientAuthService],
    controllers: [ClientAuthController],
    exports: [ClientAuthService],
})

export class ClientAuthModule {}
