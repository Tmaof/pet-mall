import { deleteAddress, getAddressList, setDefaultAddress } from '@/api/client/address';
import { AddressDto } from '@/api/client/address/res.dto';
import { useEffect, useState } from 'react';

export function useAddressList() {
  const [addressList, setAddressList] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(false);

  /** 加载地址列表 */
  const loadAddressList = async () => {
    setLoading(true);
    try {
      const { list } = await getAddressList();
      setAddressList(list);
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
