import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateTagDto {
    @IsNotEmpty({ message: '标签名称不能为空' })
    @IsString({ message: '标签名称必须是字符串' })
    @Length(1, 50, { message: '标签名称长度必须在1-50个字符之间' })
        name: string;
}

export class UpdateTagDto extends PartialType(CreateTagDto) {}
