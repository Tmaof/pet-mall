import { ProductDto } from '@/modules/product/product/res-dto/product.dto';

/** 客户收藏列表 响应dto */
export class FavoriteListResDto {
    items: ProductDto[];
    total: number;
}
