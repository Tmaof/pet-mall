import { PredictMode, PredictStatus } from '@/components/AiImgSearch/constants';
import { CameraOutlined, ReloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Modal, Radio, Space } from 'antd';
import { FC, useCallback, useState } from 'react';
import CameraArea from './components/CameraArea/index';
import LoadingOverlay from './components/LoadingOverlay/index';
import ResultArea from './components/ResultArea/index';
import UploadArea from './components/UploadArea/index';
import { usePredict } from './hooks/usePredict';
import './index.scss';
import { useNavigate } from 'react-router-dom';

/**
 * 图像识别对话框组件属性
 */
export interface AiImgSearchProps {
  /**
   * 是否打开对话框
   */
  open: boolean;
  /**
   * 关闭对话框回调
   */
  onCancel: () => void;
}

/**
 * 图像识别对话框组件
 */
const AiImgSearch: FC<AiImgSearchProps> = ({ open, onCancel }) => {
  const navigate = useNavigate();

  /**
   * 识别模式
   */
  const [mode, setMode] = useState<PredictMode>(PredictMode.UPLOAD);

  /**
   * 使用预测Hook
   */
  const { status, result, error, imageUrl, reset, setImage, startPredict, getConfidenceLevel } =
    usePredict();

  /**
   * 处理模式切换
   * @param e 事件对象
   */
  const handleModeChange = useCallback(
    (e: any) => {
      setMode(e.target.value);
      reset();
    },
    [reset]
  );

  /**
   * 处理关闭对话框
   */
  const handleClose = useCallback(() => {
    reset();
    onCancel();
  }, [reset, onCancel]);

  /**
   * 处理重新识别
   */
  const handleRetry = useCallback(() => {
    reset();
  }, [reset]);

  /**
   * 处理开始识别
   */
  const handleStartPredict = useCallback(() => {
    startPredict();
  }, [startPredict]);

  /** 跳转搜索中心 */
  const handleJumpSearch = (value: string) => {
    if (value) {
      handleClose();
      setTimeout(() => {
        navigate(`/search?keyword=${value}&type=all`);
      }, 100);
    }
  };

  return (
    <Modal
      title="AI图像识别"
      open={open}
      onCancel={handleClose}
      footer={null}
      width={600}
      destroyOnClose
      className="ai-img-search-modal"
    >
      <div className="ai-img-search-container">
        <div className="ai-img-search-header">
          <div className="ai-img-search-title">选择识别方式</div>
          <Radio.Group
            value={mode}
            onChange={handleModeChange}
            className="ai-img-search-mode-switch"
          >
            <Radio.Button value={PredictMode.UPLOAD}>
              <UploadOutlined /> 上传图片
            </Radio.Button>
            <Radio.Button value={PredictMode.CAMERA}>
              <CameraOutlined /> 拍照识别
            </Radio.Button>
          </Radio.Group>
        </div>

        <div className="ai-img-search-content">
          {/* 图片预览 */}
          {imageUrl ? (
            <img src={imageUrl} alt="预览" className="ai-img-search-preview" />
          ) : mode === PredictMode.UPLOAD ? (
            // 图片生成的方式
            <UploadArea status={status} onSetImage={setImage} />
          ) : (
            <CameraArea status={status} onSetImage={setImage} />
          )}

          {/* 加载中 */}
          {status === PredictStatus.PROCESSING && <LoadingOverlay />}

          {/* 错误 */}
          {error && <div className="ai-img-search-error">{error}</div>}

          {/* 识别结果 */}
          {result && status === PredictStatus.COMPLETED && (
            <ResultArea
              result={result}
              getConfidenceLevel={getConfidenceLevel}
              handleJumpSearch={handleJumpSearch}
            />
          )}

          {/* 操作按钮 */}
          <div className="ai-img-search-actions">
            <Space>
              <Button onClick={handleClose}>关闭</Button>
              {imageUrl && status !== PredictStatus.PROCESSING && (
                <Button type="primary" onClick={handleStartPredict}>
                  开始识别
                </Button>
              )}
              {status === PredictStatus.COMPLETED && (
                <Button icon={<ReloadOutlined />} onClick={handleRetry}>
                  重新识别
                </Button>
              )}
            </Space>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export { AiImgSearch };
