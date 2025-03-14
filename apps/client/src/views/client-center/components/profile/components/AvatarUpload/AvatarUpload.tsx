import { uploadFile } from '@/api/upload/upload';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload, message } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { FC, useState } from 'react';

interface Props {
  value?: string;
  onChange?: (url: string) => void;
}

const AvatarUpload: FC<Props> = ({ value, onChange }) => {
  const [loading, setLoading] = useState(false);

  /** 上传前校验 */
  const beforeUpload = (file: RcFile) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('只能上传图片文件!');
      return false;
    }
    // const isLt2M = file.size / 1024 / 1024 < 2;
    // if (!isLt2M) {
    //   message.error('图片大小不能超过 2MB!');
    //   return false;
    // }
    return true;
  };

  /** 处理上传变化 */
  const handleChange = async (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      try {
        const res = await uploadFile(info.file.originFileObj as File);
        const url = Object.values(res.succMap)[0];
        onChange?.(url);
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Upload
      name="avatar"
      listType="picture-circle"
      showUploadList={false}
      beforeUpload={beforeUpload}
      onChange={handleChange}
      customRequest={({ onSuccess }) => {
        setTimeout(() => {
          onSuccess?.('ok');
        }, 0);
      }}
    >
      {value ? (
        <img
          src={value}
          alt="avatar"
          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
        />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>上传头像</div>
        </div>
      )}
    </Upload>
  );
};

export { AvatarUpload };
