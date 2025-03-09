import { Form } from 'antd';

export function useSigninForm() {
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
  };

  return {
    form,
    rules,
  };
}
