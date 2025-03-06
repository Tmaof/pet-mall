import {
    IsNotEmpty, IsNumber, IsString, IsOptional, Length, Min, Max,
    IsBoolean
} from 'class-validator';

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
    @IsBoolean({ message: '是否上架必须是布尔值' })
        isOnSale?: boolean;
}
