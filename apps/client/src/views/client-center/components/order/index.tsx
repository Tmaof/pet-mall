import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from '@/api/client/order/enum';
import { OrderDto } from '@/api/client/order/res.dto';
import { Button, Card, Empty, Image, Skeleton, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useOrderList } from './hooks/useOrderList';
import './index.scss';

/** 订单列表 */
const Order = () => {
  const { orderList, loading, handleCancelOrder } = useOrderList();
  const navigate = useNavigate();

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
        <Button key="pay" type="primary" onClick={() => navigate(`/payment/${order.id}`)}>
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
        <Button key="confirm" type="primary" onClick={() => navigate(`/order/${order.id}`)}>
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

    return actions;
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
    </div>
  );
};

export { Order };
