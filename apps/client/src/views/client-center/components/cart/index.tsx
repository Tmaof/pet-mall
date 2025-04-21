import { CartItemDto } from '@/api/behaviour/cart/res.dto';
import { Checkbox, Empty, Pagination, Spin } from 'antd';
import { useEffect } from 'react';
import { ActionBar } from './components/ActionBar';
import { CartItem } from './components/CartItem';
import { PAGINATION_CONFIG } from './constants';
import { useCart } from './hooks/useCart';
import './index.scss';

/**
 * 购物车组件
 */
export const Cart = () => {
  const {
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
  } = useCart();

  useEffect(() => {
    fetchCartList();
  }, [fetchCartList]);

  /**
   * 处理全选/取消全选
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const list = cartList.map(item => item.id);
      setSelectedRowKeys(list);
      return;
    }
    setSelectedRowKeys([]);
  };

  /** 处理item选中 */
  const handleSelectItem = (checked: boolean, item: CartItemDto) => {
    const newSelectedRowKeys = checked
      ? [...selectedRowKeys, item.id]
      : selectedRowKeys.filter(id => id !== item.id);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  /**
   * 处理购买
   */
  const handleBuy = () => {
    // TODO: 实现购买逻辑
    console.log('购买商品:', selectedRowKeys);
  };

  return (
    <div className="cart-container">
      <Spin spinning={loading}>
        {cartList.length === 0 ? (
          <Empty description="购物车为空" />
        ) : (
          <>
            <div className="cart-header">
              <Checkbox
                className="check-all-box"
                indeterminate={
                  selectedRowKeys.length > 0 && selectedRowKeys.length < cartList.length
                }
                onChange={e => handleSelectAll(e.target.checked)}
              >
                全选
              </Checkbox>
              <ActionBar
                selectedCount={selectedRowKeys.length}
                totalPrice={calculateTotalPrice()}
                onDelete={() => handleDeleteItems(selectedRowKeys)}
                onBuy={handleBuy}
              />
            </div>
            <div className="cart-list">
              {cartList.map(item => (
                <div key={item.id} className="cart-item-wrapper">
                  <Checkbox
                    checked={selectedRowKeys.includes(item.id)}
                    onChange={e => handleSelectItem(e.target.checked, item)}
                  />
                  <CartItem item={item} onQuantityChange={handleUpdateQuantity} />
                </div>
              ))}
            </div>
            <div className="cart-pagination">
              <Pagination
                current={page}
                pageSize={pageSize}
                total={total}
                onChange={setPage}
                onShowSizeChange={(_, size) => setPageSize(size)}
                pageSizeOptions={PAGINATION_CONFIG.PAGE_SIZE_OPTIONS}
                showSizeChanger
                showQuickJumper
              />
            </div>
          </>
        )}
      </Spin>
    </div>
  );
};
