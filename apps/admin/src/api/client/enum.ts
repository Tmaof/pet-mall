import i18n from '@/i18n'
import { Ref } from 'vue'
import { ClientStatus } from 'server-types/enum'
export { ClientStatus }

/** 客户状态映射 */
export const clientStatusMap: Record<ClientStatus, Ref<string>> = {
  [ClientStatus.DISABLE]: i18n.$t('client.enum.678539-0'),
  [ClientStatus.ENABLE]: i18n.$t('client.enum.678539-1')
}

/** 客户性别 */
export enum ClientGender {
    /** 未知 */
    UNKNOWN = 0,
    /** 男 */
    MALE = 1,
    /** 女 */
    FEMALE = 2,
}

/** 客户性别映射 */
export const clientGenderMap: Record<ClientGender, Ref<string>> = {
  [ClientGender.UNKNOWN]: i18n.$t('client.enum.678539-2'),
  [ClientGender.MALE]: i18n.$t('client.enum.678539-3'),
  [ClientGender.FEMALE]: i18n.$t('client.enum.678539-4')
}
