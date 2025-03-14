/** 个人信息表单验证规则 */
export const profileRules = {
  clientname: [
    { required: true, message: '请输入用户名' },
    { min: 4, max: 20, message: '用户名长度在4-20个字符之间' },
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱格式' },
    { max: 50, message: '邮箱长度不能超过50个字符' },
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
    { max: 11, message: '手机号长度不能超过11位' },
  ],
};
