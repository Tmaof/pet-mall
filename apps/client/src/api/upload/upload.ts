import request from '@/utils/request';
import type { UploadFilesResDto } from './res-dto';

/** 上传文件 */
export function uploadFile(file: File | File[]) {
  const formData = new FormData();
  if (Array.isArray(file)) {
    file.forEach(f => formData.append('file', f));
  } else {
    formData.append('file', file);
  }
  return request<UploadFilesResDto>({
    url: '/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/** 删除文件 */
export function deleteFile(url: string) {
  return request({
    url: '/upload',
    method: 'delete',
    params: { url },
  });
}
