import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS, OrderStatus } from '@/api/client/order/enum';
import { OrderDto } from '@/api/client/order/res.dto';
import { Descriptions, Image, Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

interface OrderDetailDialogProps {
  open: boolean;
  order?: OrderDto;
  onClose: () => void;
}

interface OrderItemType {
  id: number;
  mainImageSnapshot: string;
  titleSnapshot: string;
  unitPriceSnapshot: number;
  quantity: number;
}

const OrderDetailDialog: React.FC<OrderDetailDialogProps> = ({ open, order, onClose }) => {
  const columns: ColumnsType<OrderItemType> = [
    {
      title: '商品图片',
      dataIndex: 'mainImageSnapshot',
      width: 100,
      render: image => <Image width={60} height={60} src={image} />,
    },
    {
      title: '商品名称',
      dataIndex: 'titleSnapshot',
    },
    {
      title: '单价',
      dataIndex: 'unitPriceSnapshot',
      width: 120,
      render: price => `¥${price}`,
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 80,
    },
    {
      title: '小计',
      width: 120,
      render: (_, record) => `¥${(record.unitPriceSnapshot * record.quantity).toFixed(2)}`,
    },
  ];

  return (
    <Modal title="订单详情" open={open} onCancel={onClose} footer={null} width={800}>
      <Descriptions column={2} bordered>
        <Descriptions.Item label="订单编号">{order?.id}</Descriptions.Item>
        <Descriptions.Item label="订单状态">
          <Tag color={ORDER_STATUS_COLORS[order?.status as OrderStatus]}>
            {ORDER_STATUS_LABELS[order?.status as OrderStatus]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="下单时间">
          {order?.createdAt && dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
        </Descriptions.Item>
        <Descriptions.Item label="订单金额">¥{order?.totalAmount}</Descriptions.Item>

        {/* 支付信息 */}
        <Descriptions.Item label="支付方式">
          {order?.paymentMethod ? (order.paymentMethod === 1 ? '微信支付' : '支付宝') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="支付时间">
          {order?.paymentTime ? dayjs(order.paymentTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="支付单号" span={2}>
          {order?.paymentNo || '-'}
        </Descriptions.Item>

        {/* 收货信息 */}
        <Descriptions.Item label="收货信息" span={2}>
          {order?.addressSnapshot && (
            <>
              {order.addressSnapshot.consignee} {order.addressSnapshot.phone}
              <br />
              {order.addressSnapshot.province}
              {order.addressSnapshot.city}
              {order.addressSnapshot.district}
              {order.addressSnapshot.detail}
            </>
          )}
        </Descriptions.Item>

        {/* 物流信息 */}
        {order?.status === OrderStatus.SHIPPED && (
          <>
            <Descriptions.Item label="物流公司">{order.shippingCompany}</Descriptions.Item>
            <Descriptions.Item label="物流单号">{order.trackingNumber}</Descriptions.Item>
          </>
        )}

        {/* 备注 */}
        <Descriptions.Item label="订单备注" span={2}>
          {order?.remark || '-'}
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 20 }}>
        <h4>商品信息</h4>
        <Table columns={columns} dataSource={order?.orderItems} pagination={false} rowKey="id" />
      </div>
    </Modal>
  );
};

export default OrderDetailDialog;
