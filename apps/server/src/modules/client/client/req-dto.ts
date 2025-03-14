import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
    @IsNotEmpty()
    @IsString()
        clientname: string;

    @IsNotEmpty()
    @IsString()
        password: string;
}

export class UpdateClientDto {
    @IsNotEmpty()
    @IsString()
        clientname?: string;

    @IsOptional()
    @IsString()
        avatar?: string;

    @IsOptional()
    @IsString()
        introduction?: string;

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

export class UpdatePasswordDto {
    @IsNotEmpty()
    @IsString()
        oldPassword: string;

    @IsNotEmpty()
    @IsString()
        newPassword: string;
}
