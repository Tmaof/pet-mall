import request from '@/utils/request';
import { CreateAddressDto, UpdateAddressDto } from './req.dto';
import { AddressDto, AddressListDto, RegionResDto } from './res.dto';

/** 创建地址 */
export const createAddress = (data: CreateAddressDto) =>
  request<void>({
    url: '/client/address',
    method: 'POST',
    data,
  });

/** 更新地址 */
export const updateAddress = (id: number, data: UpdateAddressDto) =>
  request<void>({
    url: `/client/address/${id}`,
    method: 'PUT',
    data,
  });

/** 删除地址 */
export const deleteAddress = (id: number) =>
  request<void>({
    url: `/client/address/${id}`,
    method: 'DELETE',
  });

/** 获取地址列表 */
export const getAddressList = () =>
  request<AddressListDto>({
    url: '/client/address',
    method: 'GET',
  });

/** 获取地址详情 */
export const getAddressDetail = (id: number) =>
  request<AddressDto>({
    url: `/client/address/${id}`,
    method: 'GET',
  });

/** 设置默认地址 */
export const setDefaultAddress = (id: number) =>
  request<void>({
    url: `/client/address/default/${id}`,
    method: 'PUT',
  });

/** 获取省市区数据 */
export const getRegionTree = () =>
  request<RegionResDto>({
    url: '/address/tree',
    method: 'GET',
  });
