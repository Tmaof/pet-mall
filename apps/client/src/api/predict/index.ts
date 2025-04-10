import request from '@/utils/request';
import type { ImagePredictResDto } from './res.dto';

/**
 * 图像分类识别
 * @param data 请求数据
 * @returns 识别结果
 */
export const predictImage = (data: FormData) =>
  request<ImagePredictResDto>({
    url: '/predict',
    method: 'POST',
    data,
    baseURL: import.meta.env.VITE_APP_pyApiBaseUrl,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
