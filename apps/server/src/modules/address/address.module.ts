import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressController } from './address.controller';
import { Region } from './address.entity';
import { AddressService } from './address.service';

@Module({
    imports: [TypeOrmModule.forFeature([Region])],
    controllers: [AddressController],
    providers: [AddressService],
})
export class AddressModule {}
