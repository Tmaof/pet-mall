import { cancelOrder, confirmOrder, getOrderList } from '@/api/client/order';
import { QueryOrderDto } from '@/api/client/order/req.dto';
import { OrderDto } from '@/api/client/order/res.dto';
import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';

export function useOrderList() {
  const [orderList, setOrderList] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  /** 加载订单列表 */
  const loadOrderList = async (dto?: QueryOrderDto) => {
    setLoading(true);
    try {
      const { list, total } = await getOrderList(dto);
      setOrderList(list);
      setOrderTotal(total);
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

  /** 点击确认收货 */
  const handleConfirmReceipt = async (order: OrderDto) => {
    await confirmOrder(order.id);
    message.success('收货成功！');
    loadOrderList();
  };

  useEffect(() => {
    loadOrderList();
  }, []);

  return {
    orderList,
    /** 总订单数 */
    orderTotal,
    loading,
    handleCancelOrder,
    handleConfirmReceipt,
    loadOrderList,
  };
}
