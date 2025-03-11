import { AddressDto } from '@/api/client/address/res.dto';

/** 地址对话框Props */
export interface AddressDialogProps {
  /** 是否显示 */
  open: boolean;
  /** 编辑的地址 */
  editAddress?: AddressDto;
  /** 关闭回调 */
  onClose: () => void;
  /** 成功回调 */
  onSuccess: () => void;
}
