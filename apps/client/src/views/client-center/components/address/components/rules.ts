import { ADDRESS_CONSTANTS } from '@/api/client/address/constants';

/** 表单验证规则 */
export const rules = {
  consignee: [
    { required: true, message: '请输入收货人姓名' },
    {
      max: ADDRESS_CONSTANTS.MAX_CONSIGNEE_LENGTH,
      message: `收货人姓名不能超过${ADDRESS_CONSTANTS.MAX_CONSIGNEE_LENGTH}个字符`,
    },
  ],
  phone: [
    { required: true, message: '请输入联系电话' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
  ],
  detail: [
    { required: true, message: '请输入详细地址' },
    {
      max: ADDRESS_CONSTANTS.MAX_DETAIL_LENGTH,
      message: `详细地址不能超过${ADDRESS_CONSTANTS.MAX_DETAIL_LENGTH}个字符`,
    },
  ],
  area: [{ required: true, message: '请选择所在地区' }],
};
