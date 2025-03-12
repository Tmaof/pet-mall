import { deleteAddress, setDefaultAddress } from '@/api/client/address';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchClientAddresses } from '@/store/modules/client';
import { useEffect, useState } from 'react';

export function useAddressList() {
  const dispatch = useAppDispatch();
  const { clientAddresses: addressList } = useAppSelector(state => state.client);
  const [loading, setLoading] = useState(false);

  /** 加载地址列表 */
  const loadAddressList = async () => {
    setLoading(true);
    try {
      await dispatch(fetchClientAddresses());
    } finally {
      setLoading(false);
    }
  };

  /** 删除地址 */
  const handleDelete = async (id: number) => {
    await deleteAddress(id);
    await loadAddressList();
  };

  /** 设置默认地址 */
  const handleSetDefault = async (id: number) => {
    await setDefaultAddress(id);
    await loadAddressList();
  };

  useEffect(() => {
    loadAddressList();
  }, []);

  return {
    addressList,
    loading,
    loadAddressList,
    handleDelete,
    handleSetDefault,
  };
}
