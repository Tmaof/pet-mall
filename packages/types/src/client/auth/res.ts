import { IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninClientDto {
    @IsString()
    @IsNotEmpty()
    @Length(4, 20, { message: '客户名长度必须在$constraint1到$constraint2之间' })
        clientname: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 64, { message: '密码长度必须在$constraint1到$constraint2之间' })
        password: string;
}
