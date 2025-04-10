import { UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC, useCallback, useRef } from 'react';
import { PredictStatus } from '../../constants';
import './index.scss';

/**
 * 上传区域组件属性
 */
export interface UploadAreaProps {
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
 * 上传区域组件
 */
const UploadArea: FC<UploadAreaProps> = ({ status, onSetImage }) => {
  /**
   * 文件输入引用
   */
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * 处理点击上传区域
   */
  const handleClick = useCallback(() => {
    if (status === PredictStatus.PROCESSING) {
      return;
    }
    fileInputRef.current?.click();
  }, [status]);

  /**
   * 处理文件选择
   * @param e 事件对象
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onSetImage(file);
      }
      // 重置文件输入，以便可以再次选择相同的文件
      e.target.value = '';
    },
    [onSetImage]
  );

  return (
    <div
      className={classNames('ai-img-search-upload-area', {
        'is-processing': status === PredictStatus.PROCESSING,
      })}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <>
        <UploadOutlined className="ai-img-search-upload-area-icon" />
        <div className="ai-img-search-upload-area-text">点击或拖拽图片到此处上传</div>
      </>
    </div>
  );
};

export default UploadArea;
