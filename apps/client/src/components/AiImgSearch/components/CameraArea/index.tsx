import { CameraOutlined, StopOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { FC, useEffect } from 'react';
import { PredictStatus } from '../../constants';
import { useCamera } from './hooks/useCamera';
import './index.scss';

/**
 * 相机区域组件属性
 */
export interface CameraAreaProps {
  /**
   * 识别状态
   */
  status: PredictStatus;
  /**
   * 设置图片回调
   */
  onSetImage: (file: File) => void;
}

/**
 * 相机区域组件
 */
const CameraArea: FC<CameraAreaProps> = ({ status, onSetImage }) => {
  const { videoRef, canvasRef, isCameraActive, cameraError, startCamera, stopCamera, takePhoto } =
    useCamera();

  /**
   * 处理拍照
   */
  const handleTakePhoto = async () => {
    const file = await takePhoto();
    if (file) {
      onSetImage(file);
      stopCamera();
    }
  };

  // 组件挂载时自动启动相机
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="ai-img-search-camera-area">
      {cameraError ? (
        <div className="ai-img-search-error">{cameraError}</div>
      ) : (
        <>
          <video
            ref={videoRef}
            className="ai-img-search-camera-area-video"
            autoPlay
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="ai-img-search-camera-area-canvas" />
          <div className="ai-img-search-camera-area-controls">
            {isCameraActive ? (
              <Button
                type="primary"
                icon={<CameraOutlined />}
                onClick={handleTakePhoto}
                disabled={status === PredictStatus.PROCESSING}
              >
                拍照
              </Button>
            ) : (
              <Button
                type="primary"
                icon={<CameraOutlined />}
                onClick={startCamera}
                disabled={status === PredictStatus.PROCESSING}
              >
                启动相机
              </Button>
            )}
            {isCameraActive && (
              <Button
                danger
                icon={<StopOutlined />}
                onClick={stopCamera}
                disabled={status === PredictStatus.PROCESSING}
              >
                关闭相机
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CameraArea;
