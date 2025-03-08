import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
        clientname: string;

    @IsNotEmpty()
    @IsString()
        password: string;

    @IsOptional()
    @IsString()
        avatar?: string;

    @IsOptional()
    @IsString()
        email?: string;

    @IsOptional()
    @IsString()
        phone?: string;

    @IsOptional()
    @IsNumber()
        gender?: number;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {}
