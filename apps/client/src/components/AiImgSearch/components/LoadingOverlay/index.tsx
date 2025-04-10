import { LoadingOutlined } from '@ant-design/icons';
import { FC } from 'react';

/**
 * 加载遮罩组件
 */
const LoadingOverlay: FC = () => {
  return (
    <div className="ai-img-search-loading">
      <LoadingOutlined className="ai-img-search-spinner" spin />
      <div className="ai-img-search-loading-text">正在识别中，请稍候...</div>
    </div>
  );
};

export default LoadingOverlay;
