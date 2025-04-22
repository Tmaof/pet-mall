import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './client.entity';
import { ClientController } from './controller/client.controller';
import { ClientService } from './service/client.service';
import { AdminClientController } from './controller/admin-client.controller';
import { AdminClientService } from './service/admin-client.service';

@Module({
    imports: [TypeOrmModule.forFeature([Client])],
    controllers: [ClientController, AdminClientController],
    providers: [ClientService, AdminClientService],
    exports: [ClientService],
})
export class ClientModule {}
