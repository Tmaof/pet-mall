import { IsEnum, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';
import { ADDRESS_CONSTANTS } from '~/constants';
import { IS_DEFAULT } from '~/enum';

/** 创建地址请求DTO */
export class CreateAddressDto {
    @IsNotEmpty({ message: '收货人姓名不能为空' })
    @IsString({ message: '收货人姓名必须是字符串' })
    @Length(1, ADDRESS_CONSTANTS.MAX_CONSIGNEE_LENGTH, { message: `收货人姓名长度必须在1-${ADDRESS_CONSTANTS.MAX_CONSIGNEE_LENGTH}个字符之间` })
        consignee: string;

    @IsNotEmpty({ message: '联系电话不能为空' })
    @IsString({ message: '联系电话必须是字符串' })
    @Length(1, ADDRESS_CONSTANTS.MAX_PHONE_LENGTH, { message: `联系电话长度必须在1-${ADDRESS_CONSTANTS.MAX_PHONE_LENGTH}个字符之间` })
        phone: string;

    @IsNotEmpty({ message: '省份不能为空' })
    @IsString({ message: '省份必须是字符串' })
        province: string;

    @IsNotEmpty({ message: '省份编码不能为空' })
    @IsString({ message: '省份编码必须是字符串' })
        provinceCode: string;

    @IsNotEmpty({ message: '城市不能为空' })
    @IsString({ message: '城市必须是字符串' })
        city: string;

    @IsNotEmpty({ message: '城市编码不能为空' })
    @IsString({ message: '城市编码必须是字符串' })
        cityCode: string;

    @IsNotEmpty({ message: '区县不能为空' })
    @IsString({ message: '区县必须是字符串' })
        district: string;

    @IsNotEmpty({ message: '区县编码不能为空' })
    @IsString({ message: '区县编码必须是字符串' })
        districtCode: string;

    @IsNotEmpty({ message: '详细地址不能为空' })
    @IsString({ message: '详细地址必须是字符串' })
    @Length(1, ADDRESS_CONSTANTS.MAX_DETAIL_LENGTH, { message: `详细地址长度必须在1-${ADDRESS_CONSTANTS.MAX_DETAIL_LENGTH}个字符之间` })
        detail: string;

    @IsOptional()
    @IsEnum(IS_DEFAULT, { message: '是否默认地址参数错误' })
        isDefault?: IS_DEFAULT;
}

/** 更新地址请求DTO */
export class UpdateAddressDto extends CreateAddressDto {}
