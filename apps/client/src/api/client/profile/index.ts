import request from '@/utils/request';
import { UpdateClientDto, UpdatePasswordDto } from './req.dto';
import { Client } from './res.dto';

/** 获取当前客户信息 */
export const getCurrentClient = () => {
  return request<Client>({
    url: '/client/info',
    method: 'GET',
  });
};

/** 更新当前客户信息 */
export const updateCurrentClient = (data: UpdateClientDto) => {
  return request({
    url: '/client/info',
    method: 'POST',
    data,
  });
};

/** 更新密码 */
export const updatePassword = (data: UpdatePasswordDto) => {
  return request({
    url: '/client/password',
    method: 'POST',
    data,
  });
};
