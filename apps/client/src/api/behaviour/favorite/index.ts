import request from '@/utils/request';
import { FavoriteListResDto } from './res.dto';

/** 获取收藏列表 */
export const getFavoriteList = (data: { page: number; pageSize: number }) =>
  request<FavoriteListResDto>({
    url: '/favorite/list',
    method: 'GET',
    params: data,
  });

/**
 * 收藏商品
 */
export const collectGoods = (id: number) =>
  request<void>({
    url: `/favorite/${id}`,
    method: 'POST',
  });

/**
 * 取消收藏
 */
export const cancelCollectGoods = (id: number) =>
  request<void>({
    url: `/favorite/${id}`,
    method: 'DELETE',
  });

/**
 * 判断当前客户是否收藏了某个商品
 */
export const fetchIsCollected = (productId: number) =>
  request<boolean>({
    url: `/favorite/item/${productId}`,
    method: 'GET',
  });
