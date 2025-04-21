import request from '@/utils/request';
import { AddToCartDto, CartListQueryDto, DeleteCartItemsDto, UpdateCartItemDto } from './req.dto';
import { CartListDto } from './res.dto';

/**
 * 获取购物车列表
 */
export const getCartList = (params: CartListQueryDto) =>
  request<CartListDto>({
    url: '/cart',
    method: 'GET',
    params,
  });

/**
 * 更新购物车商品数量
 */
export const updateCartItem = (data: UpdateCartItemDto) =>
  request({
    url: '/cart',
    method: 'PUT',
    data,
  });

/**
 * 删除购物车项
 */
export const deleteCart = (cartId: number) =>
  request({
    url: `/cart/item/${cartId}`,
    method: 'DELETE',
  });

/**
 * 多选 删除购物车项
 */
export const deleteCartItems = (data: DeleteCartItemsDto) =>
  request({
    url: '/cart/items',
    method: 'DELETE',
    data,
  });

/** 添加商品到购物车 */
export const addToCart = (data: AddToCartDto) =>
  request({
    url: '/cart',
    method: 'post',
    data,
  });

/** 获取当前客户的购物车数量 */
export const getCartCount = () =>
  request({
    url: '/cart/count',
    method: 'get',
  });
