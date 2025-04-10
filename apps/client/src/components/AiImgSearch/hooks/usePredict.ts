import { predictImage } from '@/api/predict';
import type { ImagePredictResDto } from '@/api/predict/res.dto';
import {
  CONFIDENCE_THRESHOLD,
  ConfidenceLevel,
  PredictStatus,
} from '@/components/AiImgSearch/constants';
import { message } from 'antd';
import { useCallback, useRef, useState } from 'react';

/**
 * 图像识别Hook
 * @returns 图像识别相关状态和方法
 */
export const usePredict = () => {
  /**
   * 识别状态
   */
  const [status, setStatus] = useState<PredictStatus>(PredictStatus.INITIAL);

  /**
   * 识别结果
   */
  const [result, setResult] = useState<ImagePredictResDto | null>(null);

  /**
   * 错误信息
   */
  const [error, setError] = useState<string>('');

  /**
   * 图片URL
   */
  const [imageUrl, setImageUrl] = useState<string>('');

  /**
   * 文件引用
   */
  const fileRef = useRef<File | null>(null);

  /**
   * 重置状态
   */
  const reset = useCallback(() => {
    setStatus(PredictStatus.INITIAL);
    setResult(null);
    setError('');
    setImageUrl('');
    fileRef.current = null;
  }, []);

  /**
   * 设置图片
   * @param file 图片文件
   */
  const setImage = useCallback((file: File) => {
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }, []);

  /**
   * 开始识别
   */
  const startPredict = useCallback(async () => {
    if (!fileRef.current) {
      message.error('请先选择图片');
      return;
    }

    try {
      setStatus(PredictStatus.PROCESSING);
      setError('');

      const formData = new FormData();
      formData.append('file', fileRef.current);

      const data = await predictImage(formData);
      setResult(data);
      setStatus(PredictStatus.COMPLETED);
    } catch (err) {
      setError(err instanceof Error ? err.message : '识别失败，请重试');
      setStatus(PredictStatus.FAILED);
    }
  }, []);

  /**
   * 获取置信度等级
   * @param confidence 置信度
   * @returns 置信度等级
   */
  const getConfidenceLevel = useCallback((confidence: number): ConfidenceLevel => {
    if (confidence >= CONFIDENCE_THRESHOLD[ConfidenceLevel.HIGH]) {
      return ConfidenceLevel.HIGH;
    } else if (confidence >= CONFIDENCE_THRESHOLD[ConfidenceLevel.MEDIUM]) {
      return ConfidenceLevel.MEDIUM;
    } else {
      return ConfidenceLevel.LOW;
    }
  }, []);

  return {
    status,
    result,
    error,
    imageUrl,
    reset,
    setImage,
    startPredict,
    getConfidenceLevel,
  };
};
