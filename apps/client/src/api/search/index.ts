import request from '@/utils/request';
import { SearchProductReqDto } from './req.dto';
import { SearchProductResDto } from './res.dto';

/** 搜索商品 */
export const searchProducts = (params: SearchProductReqDto) =>
  request<SearchProductResDto>({
    url: '/search/products',
    method: 'GET',
    params,
  });
