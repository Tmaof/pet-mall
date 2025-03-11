/** 地址表单值类型 */
export interface AddressFormValues {
  /** 收货人姓名 */
  consignee: string;
  /** 联系电话 */
  phone: string;
  /** 省份 */
  province: string;
  /** 省份编码 */
  provinceCode: string;
  /** 城市 */
  city: string;
  /** 城市编码 */
  cityCode: string;
  /** 区县 */
  district: string;
  /** 区县编码 */
  districtCode: string;
  /** 详细地址 */
  detail: string;
}
