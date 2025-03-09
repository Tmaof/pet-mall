import { Type } from 'class-transformer';
import {
    IsInt, IsNotEmpty, IsOptional, IsString, Length, Min
} from 'class-validator';

export class SearchProductDto {
    @IsNotEmpty({ message: '搜索关键词不能为空' })
    @IsString({ message: '搜索关键词必须是字符串' })
    @Length(1, 50, { message: '搜索关键词长度必须在1-50个字符之间' })
        keyword: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '页码必须是整数' })
    @Min(1, { message: '页码必须大于0' })
        page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '每页条数必须是整数' })
    @Min(1, { message: '每页条数必须大于0' })
        pageSize?: number;
}
