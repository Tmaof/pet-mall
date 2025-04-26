import { deleteFile, uploadFile } from '@/api/upload/upload';
import { Form, Input, Modal, Rate, Upload, message } from 'antd';
import { RcFile, UploadFile } from 'antd/es/upload/interface';
import { useState } from 'react';
import './index.scss';

const { TextArea } = Input;

export interface ReviewProductDiaProps {
  open: boolean;
  /** 对话框关闭 */
  onCancel?: () => void;
  /** 点击确认 */
  onSubmit?: (values: { rating: number; content: string; images: string[] }) => void;
}

export const ReviewProductDia = (props: ReviewProductDiaProps) => {
  const { open, onCancel, onSubmit } = props;
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const handleUpload = async (file: RcFile) => {
    try {
      const res = await uploadFile(file);
      const url = Object.values(res.succMap)[0];
      setFileList(prev => [
        ...prev,
        {
          uid: url,
          name: file.name,
          status: 'done',
          url,
        },
      ]);
      return false;
    } catch {
      message.error('上传失败');
      return false;
    }
  };

  const handleRemove = (file: UploadFile) => {
    setFileList(prev => prev.filter(item => item.uid !== file.uid));
    if (file.url) deleteFile(file.url);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit?.({
        ...values,
        images: fileList.map(file => file.url),
      });
      form.resetFields();
      setFileList([]);
      onCancel?.();
    } catch (error) {
      console.error('表单验证失败:', error);
    }
  };

  return (
    <Modal
      title="商品评价"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={600}
      okText="提交"
      cancelText="取消"
      className="review-product-dialog"
    >
      <Form form={form} layout="vertical" requiredMark={false}>
        <Form.Item
          label="商品评分"
          name="rating"
          rules={[{ required: true, message: '请对商品进行评分' }]}
        >
          <Rate count={5} />
        </Form.Item>

        <Form.Item
          label="评价内容"
          name="content"
          rules={[{ max: 500, message: '评价内容不能超过500字' }]}
        >
          <TextArea
            rows={4}
            placeholder="请输入您的评价内容，最多500字"
            maxLength={500}
            showCount
          />
        </Form.Item>

        <Form.Item label="上传图片">
          <Upload
            listType="picture-card"
            fileList={fileList}
            onRemove={handleRemove}
            beforeUpload={handleUpload}
            maxCount={10}
            accept="image/*"
          >
            {fileList.length < 10 && (
              <div>
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            )}
          </Upload>
          <div className="upload-tip">最多上传10张图片，支持jpg、png、gif格式</div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
