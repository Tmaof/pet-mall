import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ClientGender, ClientStatus } from '~/enum';

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

/**
 * 查询客户列表
 */
export class QueryClientListDto {
    @IsOptional()
    @IsNumber()
        id?: number;

    @IsOptional()
    @IsString()
        clientname?: string;

    @IsOptional()
    @IsEnum(ClientGender)
        gender?: ClientGender;

    @IsOptional()
    @IsEnum(ClientStatus)
        status?: ClientStatus;

    @IsOptional()
    @IsString()
        startTime?: string;

    @IsOptional()
    @IsString()
        endTime?: string;

    @IsOptional()
    @IsNumber()
        page?: number = 1;

    @IsOptional()
    @IsNumber()
        pageSize?: number = 10;
}
