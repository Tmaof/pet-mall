import { message } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 相机Hook
 * @returns 相机相关状态和方法
 */
export const useCamera = () => {
  /**
   * 视频元素引用
   */
  const videoRef = useRef<HTMLVideoElement | null>(null);

  /**
   * 画布元素引用
   */
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  /**
   * 媒体流引用
   */
  const streamRef = useRef<MediaStream | null>(null);

  /**
   * 相机状态
   */
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  /**
   * 相机错误
   */
  const [cameraError, setCameraError] = useState<string>('');

  /**
   * 启动相机
   */
  const startCamera = useCallback(async () => {
    try {
      setCameraError('');

      // 请求相机权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraActive(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '无法访问相机';
      setCameraError(errorMessage);
      message.error(errorMessage);
    }
  }, []);

  /**
   * 停止相机
   */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  }, []);

  /**
   * 拍照
   * @returns 图片文件
   */
  const takePhoto = useCallback(async (): Promise<File | null> => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      message.error('相机未启动');
      return null;
    }

    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        message.error('无法获取画布上下文');
        return null;
      }

      // 设置画布尺寸与视频一致
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // 绘制视频帧到画布
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 将画布内容转换为Blob
      return new Promise<File | null>(resolve => {
        canvas.toBlob(
          blob => {
            if (blob) {
              // 创建文件对象
              const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
              resolve(file);
            } else {
              message.error('拍照失败');
              resolve(null);
            }
          },
          'image/jpeg',
          0.95
        );
      });
    } catch (err) {
      message.error('拍照失败' + err);
      return null;
    }
  }, [isCameraActive]);

  // 组件卸载时停止相机
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isCameraActive,
    cameraError,
    startCamera,
    stopCamera,
    takePhoto,
  };
};
