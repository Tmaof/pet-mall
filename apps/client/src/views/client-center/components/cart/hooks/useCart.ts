import { deleteCartItems, getCartList, updateCartItem } from '@/api/behaviour/cart';
import { CartListDto } from '@/api/behaviour/cart/res.dto';
import { createOrder } from '@/api/client/order';
import { usePaymentQRDia } from '@/components/PaymentQRDia/hook';
import { useShowSelectClientAddress } from '@/components/SelectClientAddress/hooks';
import { useAppDispatch } from '@/store';
import { setCartCount } from '@/store/modules/client';
import { isDisabledOfProduct } from '@/utils';
import { message, Modal } from 'antd';
import { useCallback, useState } from 'react';
import { CreateOrderDto } from 'server/modules/order/req-dto';
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
  const { showSelectClientAddress } = useShowSelectClientAddress();
  const { showPaymentQRDia } = usePaymentQRDia();
  const dispatch = useAppDispatch();

  /**
   * 获取购物车列表
   */
  const fetchCartList = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCartList({ page, pageSize });
      setCartList(res.items);
      setTotal(res.total);
      // 更新购物车数量
      dispatch(setCartCount(res.total));
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

  /** 删除购物车项 */
  const deleteCart = useCallback(
    async (cartItemIds: number[]) => {
      await deleteCartItems({ cartItemIds });
      setSelectedRowKeys([]);
      fetchCartList();
    },
    [fetchCartList]
  );

  /**
   * 处理删除购物车项
   */
  const handleDeleteItems = useCallback(
    async (cartItemIds: number[]) => {
      Modal.warning({
        title: '确定删除选择的购物车项吗',
        okText: '确定',
        cancelText: '取消',
        closable: true,
        onOk: async () => {
          await deleteCart(cartItemIds);
          message.success('删除成功');
        },
      });
    },
    [deleteCart]
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

  /**
   * 处理购买
   */
  const handleBuy = () => {
    // 选择的cart
    const selectCarts = cartList.filter(cart => selectedRowKeys.includes(cart.id));
    // 过滤掉 禁用商品
    const validCart = selectCarts.filter(cart => !isDisabledOfProduct(cart.product));
    if (validCart.length !== selectCarts.length) {
      // 修改选择项，只包含合法cart
      setSelectedRowKeys(validCart.map(cart => cart.id));
      message.warning({
        content: '选择商品中包含不可购买商品，已经为您过滤，请重新确认购买',
        duration: 5,
      });
      return;
    }

    // 选择地址
    showSelectClientAddress({
      onSelect: async address => {
        if (!address) return;
        const items = validCart.map(cart => ({
          productId: cart.product.id,
          quantity: cart.count,
        }));
        const data: CreateOrderDto = {
          items,
          addressId: address.id,
        };
        // 创建订单
        const order = await createOrder(data);
        // 跳转至支付
        showPaymentQRDia({
          order,
          onOk: () => {},
        });
        // 创建订单成功，从购物车删除这些商品
        deleteCart(validCart.map(cart => cart.id));
      },
    });
  };

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
    handleBuy,
  };
};
