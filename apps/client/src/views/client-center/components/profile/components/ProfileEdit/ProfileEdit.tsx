import { ClientGender } from '@/api/client/profile/enum';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateClientInfo } from '@/store/modules/client';
import { Button, Form, Input, message, Radio } from 'antd';
import { FC, useEffect } from 'react';
import { AvatarUpload } from '../AvatarUpload/AvatarUpload';
import './ProfileEdit.scss';
import { profileRules } from './rules';

interface Props {
  onCancel: () => void;
  onSubmit: () => void;
}

const ProfileEdit: FC<Props> = ({ onCancel, onSubmit }) => {
  const [profileForm] = Form.useForm();
  const dispatch = useAppDispatch();
  const { clientInfo } = useAppSelector(state => state.client);

  useEffect(() => {
    if (clientInfo) {
      profileForm.setFieldsValue(clientInfo);
    }
  }, [clientInfo, profileForm]);

  /** 处理编辑提交 */
  const handleSubmit = async () => {
    try {
      const values = await profileForm.validateFields();
      await dispatch(updateClientInfo(values));
      message.success('更新成功');
      onSubmit();
    } catch (error) {
      console.error('Update profile failed:', error);
    }
  };

  return (
    <div className="profile-edit">
      <Form form={profileForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item name="avatar" className="avatar-upload">
          <AvatarUpload />
        </Form.Item>

        <Form.Item label="用户名" name="clientname" rules={profileRules.clientname}>
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          // @ts-expect-error 类型断言
          rules={profileRules.email}
        >
          <Input placeholder="请输入邮箱" />
        </Form.Item>

        <Form.Item label="手机号" name="phone" rules={profileRules.phone}>
          <Input placeholder="请输入手机号" />
        </Form.Item>

        <Form.Item label="性别" name="gender">
          <Radio.Group>
            <Radio value={ClientGender.MALE}>男</Radio>
            <Radio value={ClientGender.FEMALE}>女</Radio>
            <Radio value={ClientGender.UNKNOWN}>保密</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="个人简介" name="introduction">
          <Input.TextArea rows={4} placeholder="请输入个人简介" />
        </Form.Item>

        <Form.Item className="form-actions">
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export { ProfileEdit };
