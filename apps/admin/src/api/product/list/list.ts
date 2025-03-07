import request from '@/utility/request'
import type { ProductListDto, ProductDto } from './res-dto'
import type { QueryProductDto } from './req-dto'

/** 获取商品列表 */
export function getProductList(params: QueryProductDto) {
  return request<ProductListDto>({
    url: '/product',
    method: 'get',
    params
  })
}

/** 更新商品 */
export function updateProduct(id: number, data: Partial<ProductDto>) {
  return request<ProductDto>({
    url: `/product/${id}`,
    method: 'put',
    data
  })
}

/** 删除商品 */
export function deleteProduct(id: number) {
  return request({
    url: `/product/${id}`,
    method: 'delete'
  })
}

/** 获取单个商品 */
export function getProduct(id: number) {
  return request<ProductDto>({
    url: `/product/${id}`,
    method: 'get'
  })
}
