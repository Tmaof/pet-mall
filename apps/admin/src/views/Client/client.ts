import { ClientGender, ClientStatus } from '@/api/client/enum'

/**
 * 客户性别选项
 */
export const GENDER_OPTIONS = [
  { label: '未知', value: ClientGender.UNKNOWN },
  { label: '男', value: ClientGender.MALE },
  { label: '女', value: ClientGender.FEMALE }
]

/**
 * 客户状态选项
 */
export const STATUS_OPTIONS = [
  { label: '禁用', value: ClientStatus.DISABLE, type: 'danger' },
  { label: '启用', value: ClientStatus.ENABLE, type: 'success' }
]
