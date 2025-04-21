import { deleteCartItems, getCartList, updateCartItem } from '@/api/behaviour/cart';
import { CartListDto } from '@/api/behaviour/cart/res.dto';
import { message } from 'antd';
import { useCallback, useState } from 'react';
import { PAGINATION_CONFIG } from '../constants';

/**
 * 购物车Hook
 */
export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [cartList, setCartList] = useState<CartListDto['items']>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(PAGINATION_CONFIG.DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(PAGINATION_CONFIG.DEFAULT_PAGE_SIZE);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  /**
   * 获取购物车列表
   */
  const fetchCartList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCartList({ page, pageSize });
      setCartList(res.items);
      setTotal(res.total);
    } catch (error) {
      console.error('获取购物车列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  /**
   * 更新购物车商品数量
   */
  const handleUpdateQuantity = useCallback(
    async (cartItemId: number, quantity: number) => {
      try {
        await updateCartItem({ cartItemId, quantity });
        message.success('更新成功');
        fetchCartList();
      } catch (error) {
        console.error('更新购物车商品数量失败:', error);
      }
    },
    [fetchCartList]
  );

  /**
   * 删除购物车项
   */
  const handleDeleteItems = useCallback(
    async (cartItemIds: number[]) => {
      try {
        await deleteCartItems({ cartItemIds });
        message.success('删除成功');
        setSelectedRowKeys([]);
        fetchCartList();
      } catch (error) {
        console.error('删除购物车项失败:', error);
      }
    },
    [fetchCartList]
  );

  /**
   * 计算选中商品总价
   */
  const calculateTotalPrice = useCallback(() => {
    return selectedRowKeys.reduce((total, cartItemId) => {
      const item = cartList.find(item => item.id === cartItemId);
      return total + (item ? item.product.price * item.count : 0);
    }, 0);
  }, [selectedRowKeys, cartList]);

  return {
    loading,
    cartList,
    total,
    page,
    pageSize,
    selectedRowKeys,
    setPage,
    setPageSize,
    setSelectedRowKeys,
    fetchCartList,
    handleUpdateQuantity,
    handleDeleteItems,
    calculateTotalPrice,
  };
};
