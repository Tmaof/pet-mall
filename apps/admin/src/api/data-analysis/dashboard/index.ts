import request from '@/utility/request'
import { DashboardDataDto } from './res-dto'

/**
 * 获取看板数据
 */
export const getDashboardData = () => request<DashboardDataDto>({
  url: '/dashboard',
  method: 'get'
})
