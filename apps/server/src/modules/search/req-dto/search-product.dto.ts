export * from 'server-types'

// import { Type } from 'class-transformer';
// import {
//     IsInt,
//     IsOptional,
//     IsString,
//     Min,
// } from 'class-validator';
// import { SearchResultType } from '../enum';

// export class SearchProductDto {
//     @IsOptional()
//     @IsString({ message: '搜索关键词必须是字符串' })
//         keyword?: string;

//     @IsOptional()
//     @Type(() => Number)
//     @IsInt({ message: '页码必须是整数' })
//     @Min(1, { message: '页码必须大于0' })
//         page?: number;

//     @IsOptional()
//     @Type(() => Number)
//     @IsInt({ message: '每页条数必须是整数' })
//     @Min(1, { message: '每页条数必须大于0' })
//         pageSize?: number;
//     // 搜索页面可能接收的搜索参数
//     /** 类型 */
//     @IsOptional()
//         type?: SearchResultType;
//     /** 相关类型id */
//     @IsOptional()
//         id?: number;
// }
