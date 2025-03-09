import request from '@/utils/request';
import type { SigninClientDto } from './req-dto';
import type { SigninResDto } from './res-dto';

/** 注册 */
export function signup(data: SigninClientDto) {
  return request({ url: '/client-auth/signup', method: 'POST', data });
}

/** 登录 */
export function signin(data: SigninClientDto) {
  return request<SigninResDto>({ url: '/client-auth/signin', method: 'POST', data });
}

/** 退出登录 */
export function logout() {
  return request({ url: '/client-auth/logout', method: 'POST' });
}
