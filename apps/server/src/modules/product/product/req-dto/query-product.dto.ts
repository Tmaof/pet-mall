export * from 'server-types';

// import { IsOptional, IsNumber, IsString, IsEnum, IsDateString } from 'class-validator';
// import { SALE_STATUS } from '../enum';

// /** 排序字段枚举 */
// export enum ProductOrderBy {
//     /** 价格 */
//     PRICE = 'price',
//     /** 库存 */
//     STOCK = 'stock',
//     /** 创建时间 */
//     CREATED_AT = 'createdAt'
// }

// /** 排序方式枚举 */
// export enum OrderDirection {
//     /** 升序 */
//     ASC = 'ASC',
//     /** 降序 */
//     DESC = 'DESC'
// }

// export class QueryProductDto {
//     @IsOptional()
//     @IsNumber({}, { message: '商品ID必须是数字' })
//         id?: number;

//     @IsOptional()
//     @IsString({ message: '商品标题必须是字符串' })
//         title?: string;

//     @IsOptional()
//     @IsNumber({}, { message: '分类ID必须是数字' })
//         categoryId?: number;

//     @IsOptional()
//     @IsEnum(SALE_STATUS, { message: '是否上架必须是数字' })
//         isOnSale?: SALE_STATUS;

//     @IsOptional()
//     @IsDateString({}, { message: '创建开始时间格式不正确' })
//         createdAtStart?: string;

//     @IsOptional()
//     @IsDateString({}, { message: '创建结束时间格式不正确' })
//         createdAtEnd?: string;

//     @IsOptional()
//     @IsDateString({}, { message: '更新开始时间格式不正确' })
//         updatedAtStart?: string;

//     @IsOptional()
//     @IsDateString({}, { message: '更新结束时间格式不正确' })
//         updatedAtEnd?: string;

//     @IsOptional()
//     @IsEnum(ProductOrderBy, { message: '排序字段不正确' })
//         orderBy?: ProductOrderBy;

//     @IsOptional()
//     @IsEnum(OrderDirection, { message: '排序方式不正确' })
//         orderDirection?: OrderDirection;

//     @IsOptional()
//     @IsNumber({}, { message: '页码必须是数字' })
//         page?: number;

//     @IsOptional()
//     @IsNumber({}, { message: '每页数量必须是数字' })
//         pageSize?: number;
// }
