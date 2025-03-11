/** 地址表单字段 */
export const ADDRESS_FORM_FIELDS = {
  /** 收货人姓名 */
  CONSIGNEE: 'consignee',
  /** 联系电话 */
  PHONE: 'phone',
  /** 省份 */
  PROVINCE: 'province',
  /** 省份编码 */
  PROVINCE_CODE: 'provinceCode',
  /** 城市 */
  CITY: 'city',
  /** 城市编码 */
  CITY_CODE: 'cityCode',
  /** 区县 */
  DISTRICT: 'district',
  /** 区县编码 */
  DISTRICT_CODE: 'districtCode',
  /** 详细地址 */
  DETAIL: 'detail',
} as const;

/** 地址表单标签 */
export const ADDRESS_FORM_LABELS = {
  [ADDRESS_FORM_FIELDS.CONSIGNEE]: '收货人姓名',
  [ADDRESS_FORM_FIELDS.PHONE]: '联系电话',
  [ADDRESS_FORM_FIELDS.PROVINCE]: '所在地区',
  [ADDRESS_FORM_FIELDS.DETAIL]: '详细地址',
} as const;
