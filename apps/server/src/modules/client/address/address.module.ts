import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientAddressController } from './address.controller';
import { Address } from './address.entity';
import { ClientAddressService } from './address.service';

@Module({
    imports: [TypeOrmModule.forFeature([Address])],
    controllers: [ClientAddressController],
    providers: [ClientAddressService],
    exports: [ClientAddressService],
})
export class ClientAddressModule {}
