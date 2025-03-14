import { Client } from '@/api/client/profile/res.dto';
import { UserOutlined } from '@ant-design/icons';
import { Button, Descriptions, Image } from 'antd';
import { FC, useState } from 'react';
import { UpdatePasswordForm } from '../UpdatePasswordForm/UpdatePasswordForm';
import './ProfileDisplay.scss';

interface Props {
  data: Client | null;
  onEdit: () => void;
}

const ProfileDisplay: FC<Props> = ({ data, onEdit }) => {
  const [passwordModal, setPasswordModal] = useState(false);

  if (!data) return null;

  return (
    <div className="profile-display">
      <div className="profile-header">
        <div className="avatar-wrapper">
          {data.avatar ? (
            <Image preview src={data.avatar} alt="avatar" className="avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              <UserOutlined />
            </div>
          )}
        </div>
        <div className="profile-actions">
          <Button type="primary" onClick={onEdit}>
            编辑信息
          </Button>
          <Button onClick={() => setPasswordModal(true)}>修改密码</Button>
        </div>
      </div>

      <Descriptions column={1} className="profile-info">
        <Descriptions.Item label="用户名">{data.clientname}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{data.email || '未设置'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{data.phone || '未设置'}</Descriptions.Item>
        <Descriptions.Item label="性别">
          {data.gender === 1 ? '男' : data.gender === 2 ? '女' : '保密'}
        </Descriptions.Item>
        <Descriptions.Item label="个人简介">
          {data.introduction || '这个人很懒，什么都没写~'}
        </Descriptions.Item>
      </Descriptions>

      <UpdatePasswordForm
        passwordModal={passwordModal}
        onCancel={() => setPasswordModal(false)}
        onSuccess={() => setPasswordModal(false)}
      />
    </div>
  );
};

export { ProfileDisplay };
