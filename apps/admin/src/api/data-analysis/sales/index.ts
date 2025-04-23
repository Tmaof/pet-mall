import request from '@/utility/request'
import type { SalesAnalysisReqDto } from './req-dto'
import type { SalesAnalysisResDto } from './res-dto'

/**
 * 获取销售分析数据
 */
export function getSalesAnalysis(params: SalesAnalysisReqDto) {
  return request<SalesAnalysisResDto>({
    url: '/sales-analysis',
    method: 'get',
    params
  })
}
