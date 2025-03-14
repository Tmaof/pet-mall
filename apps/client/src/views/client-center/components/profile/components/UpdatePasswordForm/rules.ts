import type { Rule } from 'antd/es/form';

/** 密码表单验证规则 */
export const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入原密码' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间' },
  ],
  newPassword: [
    { required: true, message: '请输入新密码' },
    { min: 6, max: 20, message: '密码长度在6-20个字符之间' },
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码' },
    ({ getFieldValue }: { getFieldValue: (name: string) => string }) =>
      ({
        validator(_, value) {
          if (!value || getFieldValue('newPassword') === value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('两次输入的密码不一致'));
        },
      }) as Rule,
  ],
};
