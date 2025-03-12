import { cancelOrder, getOrderList } from '@/api/client/order';
import { OrderDto } from '@/api/client/order/res.dto';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';

export function useOrderList() {
  const [orderList, setOrderList] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);

  /** 加载订单列表 */
  const loadOrderList = async () => {
    setLoading(true);
    try {
      const { list } = await getOrderList();
      setOrderList(list);
    } finally {
      setLoading(false);
    }
  };

  /** 取消订单 */
  const handleCancelOrder = (id: number) => {
    Modal.confirm({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      async onOk() {
        await cancelOrder(id);
        await loadOrderList();
      },
    });
  };

  useEffect(() => {
    loadOrderList();
  }, []);

  return {
    orderList,
    loading,
    handleCancelOrder,
  };
}
