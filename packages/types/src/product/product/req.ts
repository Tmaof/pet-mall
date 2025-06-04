import { PartialType } from '@nestjs/mapped-types';
import {
    IsArray,
    IsDateString,
    IsEnum,
    IsNotEmpty, IsNumber,
    IsOptional,
    IsString,
    Length,
    Max,
    Min
} from 'class-validator';
import { SALE_STATUS } from '~/enum';

export class CreateProductDto {
    @IsNotEmpty({ message: '商品标题不能为空' })
    @IsString({ message: '商品标题必须是字符串' })
    @Length(1, 100, { message: '商品标题长度必须在1-100个字符之间' })
        title: string;

    @IsNotEmpty({ message: '分类ID不能为空' })
    @IsNumber({}, { message: '分类ID必须是数字' })
        categoryId: number;

    @IsNotEmpty({ message: '主图URL不能为空' })
    @IsString({ message: '主图URL必须是字符串' })
    @Length(1, 255, { message: '主图URL长度必须在1-255个字符之间' })
        mainImage: string;

    @IsOptional()
    @IsString({ message: '商品描述必须是字符串' })
        description?: string;

    @IsNotEmpty({ message: '价格不能为空' })
    @IsNumber({}, { message: '价格必须是数字' })
    @Min(0, { message: '价格不能小于0' })
    @Max(9999999.99, { message: '价格不能大于9999999.99' })
        price: number;

    @IsNotEmpty({ message: '库存不能为空' })
    @IsNumber({}, { message: '库存必须是数字' })
    @Min(0, { message: '库存不能小于0' })
        stock: number;

    @IsOptional()
    @IsEnum(SALE_STATUS, { message: '是否上架必须是数字' })
        isOnSale?: SALE_STATUS;

    @IsOptional()
    @IsArray({ message: '标签必须是数组' })
    @IsNumber({}, { each: true, message: '标签id必须是数字' })
        tagIds?: number[];
}



/** 排序字段枚举 */
export enum ProductOrderBy {
    /** 价格 */
    PRICE = 'price',
    /** 库存 */
    STOCK = 'stock',
    /** 创建时间 */
    CREATED_AT = 'createdAt'
}

/** 排序方式枚举 */
export enum OrderDirection {
    /** 升序 */
    ASC = 'ASC',
    /** 降序 */
    DESC = 'DESC'
}

export class QueryProductDto {
    @IsOptional()
    @IsNumber({}, { message: '商品ID必须是数字' })
        id?: number;

    @IsOptional()
    @IsString({ message: '商品标题必须是字符串' })
        title?: string;

    @IsOptional()
    @IsNumber({}, { message: '分类ID必须是数字' })
        categoryId?: number;

    @IsOptional()
    @IsEnum(SALE_STATUS, { message: '是否上架必须是数字' })
        isOnSale?: SALE_STATUS;

    @IsOptional()
    @IsDateString({}, { message: '创建开始时间格式不正确' })
        createdAtStart?: string;

    @IsOptional()
    @IsDateString({}, { message: '创建结束时间格式不正确' })
        createdAtEnd?: string;

    @IsOptional()
    @IsDateString({}, { message: '更新开始时间格式不正确' })
        updatedAtStart?: string;

    @IsOptional()
    @IsDateString({}, { message: '更新结束时间格式不正确' })
        updatedAtEnd?: string;

    @IsOptional()
    @IsEnum(ProductOrderBy, { message: '排序字段不正确' })
        orderBy?: ProductOrderBy;

    @IsOptional()
    @IsEnum(OrderDirection, { message: '排序方式不正确' })
        orderDirection?: OrderDirection;

    @IsOptional()
    @IsNumber({}, { message: '页码必须是数字' })
        page?: number;

    @IsOptional()
    @IsNumber({}, { message: '每页数量必须是数字' })
        pageSize?: number;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
