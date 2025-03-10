import { ProductDto } from '@/api/index.type';
import request from '@/utils/request';
import { GetProductDetailsReqDto } from './req.dto';

/** 获取商品详情 */
export const getProductDetails = (params: GetProductDetailsReqDto) =>
  request<ProductDto>({
    url: `/product/${params.id}`,
    method: 'GET',
  });
