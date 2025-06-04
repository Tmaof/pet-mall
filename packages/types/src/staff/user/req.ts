import { IsArray, IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

class CreateUserBatchArg {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20)
        username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 64)
        password: string;

    @IsString()
        openTime?: Date;

    @IsString()
        role?: string;
}

export class CreateUserBatchDto {
    @IsArray()
        payload: CreateUserBatchArg[];
}


export class GetUserAllPagingDto {
    @IsNumber()
        page: number;

    @IsNumber()
        size?: number;
}


export class GetUserRoleDto {
    @IsNumber()
    @IsNotEmpty()
        userId: number;
}

class UpdateUserRoleArg {
    @IsString()
    @IsNotEmpty()
        name: string;

    @IsNumber()
    @IsNotEmpty()
        id: number;
}

export class UpdateUserRoleDto {
    @IsNumber()
    @IsNotEmpty()
        userId: number;

    @IsArray()
    @IsNotEmpty()
        payload: UpdateUserRoleArg[];
}
