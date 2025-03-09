import { signin } from '@/api/auth';
import type { SigninClientDto } from '@/api/auth/req-dto';
import { setToken } from '@/store/modules/client';
import { Button, Form, Input, Typography } from 'antd';
import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { WaveBackground } from '../signup/components/WaveBackground';
import { useSigninForm } from './hooks/useSigninForm';
import './index.scss';

const { Title } = Typography;

const Signin: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { form, rules } = useSigninForm();

  /** 提交表单 */
  const handleSubmit = useCallback(
    async (values: SigninClientDto) => {
      const { token } = await signin(values);
      dispatch(setToken(token));
      navigate('/');
    },
    [dispatch, navigate]
  );

  /** 如果是从注册页跳转来的,自动填充表单 */
  useEffect(() => {
    const formData = location.state as SigninClientDto;
    if (formData) {
      form.setFieldsValue(formData);
    }
  }, [form, location.state]);

  return (
    <div className="signin-page">
      <div className="floating-element" />
      <div className="floating-element" />
      <WaveBackground />
      <div className="signin-container">
        <Title level={2} className="signin-title" data-text="欢迎回来">
          欢迎回来
        </Title>
        <Form form={form} onFinish={handleSubmit} className="signin-form" size="large">
          <Form.Item name="clientname" rules={rules.clientname}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item name="password" rules={rules.password}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
          <div className="form-extra">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <label className="remember-me">
                <input type="checkbox" />
                <span>记住我</span>
              </label>
            </Form.Item>
            <Button type="link">忘记密码？</Button>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
          <div className="signin-footer">
            还没有账号？
            <Button type="link" onClick={() => navigate('/signup')}>
              去注册
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export { Signin };
