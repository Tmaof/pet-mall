import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from '@/api/client/order/enum';
import { QueryOrderDto } from '@/api/client/order/req.dto';
import { OrderDto } from '@/api/client/order/res.dto';
import { usePaymentQRDia } from '@/components/PaymentQRDia/hook';
import {
  Button,
  Card,
  Empty,
  Form,
  Image,
  Input,
  Pagination,
  Select,
  Skeleton,
  Space,
  Tag,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import { useCallback, useRef, useState } from 'react';
import OrderDetailDialog from './components/OrderDetailDialog';
import { useOrderList } from './hooks/useOrderList';
import './index.scss';

/** 订单列表 */
const Order = () => {
  const { orderList, loading, handleCancelOrder, handleConfirmReceipt, orderTotal, loadOrderList } =
    useOrderList();

  const [detailVisible, setDetailVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDto>();
  const { showPaymentQRDia } = usePaymentQRDia();
  // 搜索参数
  const [searchForm] = Form.useForm();
  const searchParams = useRef<QueryOrderDto>({});
  // 分页
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  /** 分页变化 */
  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setPagination({ current: page, pageSize });
      // 请求数据
      loadOrderList({
        page,
        pageSize,
        ...searchParams, // 携带搜索参数
      });
    },
    [loadOrderList]
  );

  /** 点击搜索 */
  function handleSearch(data: any) {
    // console.log(data);
    // 保存搜索参数
    searchParams.current = data;
    // 请求数据
    loadOrderList({
      ...pagination,
      ...data,
    });
  }

  /** 重置搜索参数 */
  function handleReset() {
    searchParams.current = {};
    loadOrderList({ ...pagination });
  }

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

  return (
    <div className="order-list-container">
      {/* 头部 */}
      <div className="order-list-header">
        <Form layout="inline" form={searchForm} onFinish={handleSearch} onReset={handleReset}>
          <Form.Item name="id" label="订单ID">
            <Input placeholder="请输入订单id" />
          </Form.Item>
          <Form.Item name="status" label="订单状态">
            <Select placeholder="请选择订单状态" style={{ width: '180px' }}>
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <div className="operating-buttons">
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button htmlType="reset">重置</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
      {/* 列表 */}
      {!orderList.length ? (
        <Empty description="暂无订单" />
      ) : (
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
        </div>
      )}
      {/* 分页 */}
      <div className="pagination-container">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={orderTotal}
          onChange={handlePageChange}
          showSizeChanger
          showQuickJumper
          showTotal={total => `共 ${total} 条`}
        />
      </div>
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
