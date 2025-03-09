import { signup } from '@/api/auth';
import type { SigninClientDto } from '@/api/auth/req-dto';
import { Button, Form, Input, message, Typography } from 'antd';
import { FC, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { WaveBackground } from './components/WaveBackground';
import { useSignupForm } from './hooks/useSignupForm';
import './index.scss';

const { Title } = Typography;

const Signup: FC = () => {
  const navigate = useNavigate();
  const { form, rules } = useSignupForm();

  /** 提交表单 */
  const handleSubmit = useCallback(
    async (values: SigninClientDto) => {
      await signup(values);
      message.success('注册成功');
      setTimeout(() => {
        // 注册成功后跳转到登录页,并传递表单数据
        navigate('/signin', { state: values });
      }, 1500);
    },
    [navigate]
  );

  return (
    <div className="signup-page">
      <div className="floating-element" />
      <div className="floating-element" />
      <WaveBackground />
      <div className="signup-container">
        <Title level={2} className="signup-title" data-text="注册账号">
          注册账号
        </Title>
        <Form form={form} onFinish={handleSubmit} className="signup-form" size="large">
          <Form.Item name="clientname" rules={rules.clientname}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={rules.password}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <Form.Item name="confirmPassword" rules={rules.confirmPassword}>
            <Input.Password placeholder="请确认密码" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
          <div className="signup-footer">
            已有账号？
            <Button type="link" onClick={() => navigate('/signin')}>
              去登录
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export { Signup };
