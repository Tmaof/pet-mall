import { AddressDto } from '@/api/client/address/res.dto';
import { useShowToDialog } from '@/utils/show-to-dialog';
import { Props, SelectClientAddress } from './index';

/** 获取一个函数：显示 选择客户地址 弹框*/
export const useShowSelectClientAddress = () => {
  const { showToDialog } = useShowToDialog();

  /** 显示 选择客户地址 弹框*/
  function showSelectClientAddress(props: Props) {
    let currentAddress: AddressDto | null = null;
    showToDialog(
      <SelectClientAddress
        {...props}
        onSelect={address => {
          currentAddress = address;
        }}
      ></SelectClientAddress>,
      {
        title: '请确认收货地址',
        footer: undefined,
        okText: '确定',
        // 当点击确认时再把数据给父组件
        onOk: () => {
          if (currentAddress) {
            props.onSelect?.(currentAddress);
          }
        },
      }
    );
  }

  return {
    showSelectClientAddress,
  };
};
