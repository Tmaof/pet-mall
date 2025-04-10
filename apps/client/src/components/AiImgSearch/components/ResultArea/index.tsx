import type { ImagePredictResDto } from '@/api/predict/res.dto';
import { CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { FC } from 'react';
import { ConfidenceLevel } from '../../constants';
import './index.scss';

/**
 * 结果展示区域组件属性
 */
export interface ResultAreaProps {
  /**
   * 识别结果
   */
  result: ImagePredictResDto;
  /**
   * 获取置信度等级回调
   */
  getConfidenceLevel: (confidence: number) => ConfidenceLevel;
  /**
   * 跳转搜索中心
   */
  handleJumpSearch: (value: string) => void;
}

/**
 * 结果展示区域组件
 */
const ResultArea: FC<ResultAreaProps> = ({ result, getConfidenceLevel, handleJumpSearch }) => {
  /**
   * 获取置信度图标
   * @param level 置信度等级
   * @returns 图标组件
   */
  const getConfidenceIcon = (level: ConfidenceLevel) => {
    switch (level) {
      case ConfidenceLevel.HIGH:
        return <CheckCircleOutlined style={{ color: 'var(--theme-success)' }} />;
      case ConfidenceLevel.MEDIUM:
        return <WarningOutlined style={{ color: 'var(--theme-warning)' }} />;
      case ConfidenceLevel.LOW:
        return <CloseCircleOutlined style={{ color: 'var(--theme-danger)' }} />;
      default:
        return null;
    }
  };

  /**
   * 格式化置信度
   * @param confidence 置信度
   * @returns 格式化后的置信度
   */
  const formatConfidence = (confidence: number) => {
    return `${(confidence * 100).toFixed(2)}%`;
  };

  return (
    <div className="ai-img-search-result">
      <div
        className="ai-img-search-result-item"
        onClick={() => handleJumpSearch(result.predicted_class)}
      >
        <div className="ai-img-search-result-item-class">
          <strong>预测类别：</strong>
          {result.predicted_class}
        </div>
        <div className="ai-img-search-result-item-confidence">
          <div className="ai-img-search-result-item-bar">
            <div
              className={classNames('ai-img-search-result-item-progress', {
                'ai-img-search-result-item-progress-high':
                  getConfidenceLevel(result.confidence) === ConfidenceLevel.HIGH,
                'ai-img-search-result-item-progress-medium':
                  getConfidenceLevel(result.confidence) === ConfidenceLevel.MEDIUM,
                'ai-img-search-result-item-progress-low':
                  getConfidenceLevel(result.confidence) === ConfidenceLevel.LOW,
              })}
              style={{ width: `${result.confidence * 100}%` }}
            />
          </div>
          <div className="ai-img-search-result-item-value">
            <span className="value-text">{formatConfidence(result.confidence)}</span>
            {getConfidenceIcon(getConfidenceLevel(result.confidence))}
          </div>
        </div>
      </div>

      <div className="ai-img-search-result-topK">
        <div className="title">
          <strong>Top K 预测结果：</strong>
        </div>

        <div className="content">
          {result.top_k_predictions.map((prediction, index) => {
            const [className, confidence] = prediction;

            return (
              <div key={index} className="topK-item" onClick={() => handleJumpSearch(className)}>
                <div className="topK-item-class">{className}</div>
                <div className="topK-item-confidence">{formatConfidence(confidence)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ResultArea;
