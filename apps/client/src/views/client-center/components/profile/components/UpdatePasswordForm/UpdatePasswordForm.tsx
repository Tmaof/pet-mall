import { updatePassword } from '@/api/client/profile';
import { UpdatePasswordDto } from '@/api/client/profile/req.dto';
import { Button, Form, Input, message, Modal } from 'antd';
import { FC } from 'react';
import { passwordRules } from './rules';

interface Props {
  onSuccess: () => void;
  passwordModal: boolean;
  onCancel: () => void;
}

const UpdatePasswordForm: FC<Props> = ({ onSuccess, passwordModal, onCancel }) => {
  const [passwordForm] = Form.useForm();

  /** 处理提交 */
  const handleSubmit = async () => {
    try {
      const values = await passwordForm.validateFields();
      await updatePassword(values as UpdatePasswordDto);
      message.success('密码修改成功');
      passwordForm.resetFields();
      onSuccess();
    } catch (error) {
      console.error('Update password failed:', error);
    }
  };

  const handleCancel = () => {
    passwordForm.resetFields();
    onCancel();
  };

  return (
    <Modal title="修改密码" open={passwordModal} onCancel={handleCancel} footer={null}>
      <Form form={passwordForm} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="原密码" name="oldPassword" rules={passwordRules.oldPassword}>
          <Input.Password placeholder="请输入原密码" />
        </Form.Item>

        <Form.Item label="新密码" name="newPassword" rules={passwordRules.newPassword}>
          <Input.Password placeholder="请输入新密码" />
        </Form.Item>

        <Form.Item
          label="确认新密码"
          name="confirmPassword"
          // @ts-expect-error 类型断言类型断言
          rules={passwordRules.confirmPassword}
        >
          <Input.Password placeholder="请确认新密码" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            确认修改
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export { UpdatePasswordForm };
