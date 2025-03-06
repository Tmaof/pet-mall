import request from '@/utility/request'
import type { CreateProductDto } from './req.dto'

/**
 * 创建商品
 * @param data
 * @returns
 */
export function createProduct (data: CreateProductDto) {
  return request({
    url: '/product',
    method: 'POST',
    data
  })
}
