import { Form } from 'antd';
import type { Rule } from 'antd/es/form';

export function useSignupForm() {
  const [form] = Form.useForm();

  /** 表单验证规则 */
  const rules = {
    clientname: [
      { required: true, message: '请输入用户名' },
      { min: 4, max: 20, message: '用户名长度在4-20个字符之间' },
    ],
    password: [
      { required: true, message: '请输入密码' },
      { min: 6, max: 20, message: '密码长度在6-20个字符之间' },
    ],
    confirmPassword: [
      { required: true, message: '请确认密码' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('password') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('两次输入的密码不一致'));
        },
      }),
    ] as Rule[],
  };

  return {
    form,
    rules,
  };
}
