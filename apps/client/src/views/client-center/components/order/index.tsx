import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from '@/api/client/order/enum';
import { OrderDto } from '@/api/client/order/res.dto';
import { usePaymentQRDia } from '@/components/PaymentQRDia/hook';
import { Button, Card, Empty, Image, Skeleton, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderDetailDialog from './components/OrderDetailDialog';
import { useOrderList } from './hooks/useOrderList';
import './index.scss';

/** 订单列表 */
const Order = () => {
  const { orderList, loading, handleCancelOrder, handleConfirmReceipt } = useOrderList();
  const navigate = useNavigate();
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDto>();
  const { showPaymentQRDia } = usePaymentQRDia();

  /** 渲染订单状态标签 */
  const renderStatusTag = (status: OrderStatus) => (
    <Tag color={ORDER_STATUS_COLORS[status]}>{ORDER_STATUS_LABELS[status]}</Tag>
  );

  /** 渲染订单操作按钮 */
  const renderActions = (order: OrderDto) => {
    const actions = [];

    // 待付款订单可以付款和取消
    if (order.status === OrderStatus.PENDING_PAYMENT) {
      actions.push(
        <Button key="pay" type="primary" onClick={() => handlePayment(order)}>
          立即付款
        </Button>,
        <Button key="cancel" onClick={() => handleCancelOrder(order.id)}>
          取消订单
        </Button>
      );
    }

    // 已发货订单可以确认收货
    if (order.status === OrderStatus.SHIPPED) {
      actions.push(
        <Button key="confirm" type="primary" onClick={() => handleConfirmReceipt(order)}>
          确认收货
        </Button>
      );
    }

    // 已完成订单可以评价
    if (order.status === OrderStatus.COMPLETED) {
      actions.push(
        <Button key="comment" onClick={() => navigate(`/order/${order.id}/comment`)}>
          评价
        </Button>
      );
    }

    actions.push(
      <Button key="detail" onClick={() => handleViewDetail(order)}>
        查看详情
      </Button>
    );

    return actions;
  };

  /** 查看订单详情 */
  const handleViewDetail = (order: OrderDto) => {
    setCurrentOrder(order);
    setDetailVisible(true);
  };

  /** 点击立即付款 */
  const handlePayment = (order: OrderDto) => {
    showPaymentQRDia({
      order,
      onOk: () => {},
    });
  };

  if (loading) {
    return (
      <div className="order-list">
        <Card>
          <Skeleton active />
        </Card>
      </div>
    );
  }

  if (!orderList.length) {
    return <Empty description="暂无订单" />;
  }

  return (
    <div className="order-list">
      {orderList.map(order => (
        <Card key={order.id} className="order-item">
          <div className="order-header">
            <div className="order-info">
              <span className="order-time">
                {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
              <span className="order-number">订单号: {order.id}</span>
            </div>
            {renderStatusTag(order.status)}
          </div>

          <div className="order-content">
            {/* 商品列表 */}
            <div className="product-list">
              {order.orderItems.map(item => (
                <div key={item.id} className="product-item">
                  <Image
                    className="product-image"
                    width={80}
                    height={80}
                    src={item.mainImageSnapshot}
                    alt={item.titleSnapshot}
                  />
                  <div className="product-info">
                    <Typography.Title level={5} ellipsis={{ rows: 2 }}>
                      {item.titleSnapshot}
                    </Typography.Title>
                    <div className="price-quantity">
                      <span className="price">
                        <span className="currency">¥</span>
                        <span className="amount">{item.unitPriceSnapshot}</span>
                      </span>
                      <span className="quantity">x{item.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 物流信息 */}
            {order.status === OrderStatus.SHIPPED && (
              <div className="logistics-info">
                <div className="info-item">
                  <span className="label">物流公司：</span>
                  <span className="value">{order.shippingCompany}</span>
                </div>
                <div className="info-item">
                  <span className="label">物流单号：</span>
                  <span className="value">{order.trackingNumber}</span>
                </div>
              </div>
            )}
            {/* 订单底部 */}
            <div className="order-footer">
              {/* 已取消订单不显示实付金额 */}
              {order.status !== OrderStatus.CANCELED_BY_CLIENT && (
                <div className="total">
                  <span className="label">实付金额:</span>
                  <span className="price">
                    <span className="currency">¥</span>
                    <span className="amount">{order.totalAmount}</span>
                  </span>
                </div>
              )}
              <Space size="middle">{renderActions(order)}</Space>
            </div>
          </div>
        </Card>
      ))}

      {/* 详情对话框 */}
      <OrderDetailDialog
        open={detailVisible}
        order={currentOrder}
        onClose={() => setDetailVisible(false)}
      />
    </div>
  );
};

export { Order };
