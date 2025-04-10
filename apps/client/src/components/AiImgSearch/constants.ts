/**
 * 图像识别模式
 */
export enum PredictMode {
  /**
   * 上传图片
   */
  UPLOAD = 'upload',
  /**
   * 拍照识别
   */
  CAMERA = 'camera',
}

/**
 * 图像识别状态
 */
export enum PredictStatus {
  /**
   * 初始状态
   */
  INITIAL = 'initial',
  /**
   * 识别中
   */
  PROCESSING = 'processing',
  /**
   * 识别完成
   */
  COMPLETED = 'completed',
  /**
   * 识别失败
   */
  FAILED = 'failed',
}

/**
 * 置信度等级
 */
export enum ConfidenceLevel {
  /**
   * 高置信度
   */
  HIGH = 'high',
  /**
   * 中置信度
   */
  MEDIUM = 'medium',
  /**
   * 低置信度
   */
  LOW = 'low',
}

/**
 * 置信度阈值
 */
export const CONFIDENCE_THRESHOLD = {
  [ConfidenceLevel.HIGH]: 0.9,
  [ConfidenceLevel.MEDIUM]: 0.7,
  [ConfidenceLevel.LOW]: 0.5,
};
