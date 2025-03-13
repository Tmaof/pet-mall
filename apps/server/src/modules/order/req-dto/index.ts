import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderStatus } from '../enum';

/** 创建订单 */
export class CreateOrderDto {
    /** 订单商品列表 */
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
        items: OrderItemDto[];

    /** 收货地址ID */
    @IsNumber()
        addressId: number;

    /** 备注 */
    @IsString()
    @IsOptional()
        remark?: string;
}

/** 订单商品项 */
export class OrderItemDto {
    /** 商品ID */
    @IsNumber()
        productId: number;

    /** 购买数量 */
    @IsNumber()
        quantity: number;
}

/** 【管理员】 更新订单状态 */
export class UpdateOrderStatusDto {
    /** 订单状态 */
    @IsNumber()
        status: OrderStatus;

    /** 物流单号 */
    @IsString()
    @IsOptional()
        trackingNumber?: string;

    /** 物流公司 */
    @IsString()
    @IsOptional()
        shippingCompany?: string;
}

/** 【客户】 更新订单状态 */
export class UpdateOrderStatusByClientDto {
    /** 订单状态 */
    @IsNumber()
        status: OrderStatus;
}

/** 查询订单 */
export class QueryOrderDto {
    /** 订单ID */
    @IsNumber()
    @IsOptional()
        id?: number;

    /** 订单状态 */
    @IsNumber()
    @IsOptional()
        status?: OrderStatus;

    /** 开始日期 */
    @IsString()
    @IsOptional()
        startDate?: string;

    /** 结束日期 */
    @IsString()
    @IsOptional()
        endDate?: string;

    /** 页码 */
    @IsNumber()
    @IsOptional()
        page?: number;

    /** 每页条数 */
    @IsNumber()
    @IsOptional()
        pageSize?: number;
}
