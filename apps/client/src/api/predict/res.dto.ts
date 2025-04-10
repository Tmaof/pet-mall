/**
 * 图像识别结果项
 */
export interface PredictionItem {
  /**
   * 预测类别
   */
  class: string;
  /**
   * 置信度
   */
  confidence: number;
}

/**
 * 图像识别响应DTO
 */
export interface ImagePredictResDto {
  /**
   * 置信度
   */
  confidence: number;
  /**
   * 预测类别
   */
  predicted_class: string;
  /**
   * Top K预测结果
   */
  top_k_predictions: [string, number][];
}
