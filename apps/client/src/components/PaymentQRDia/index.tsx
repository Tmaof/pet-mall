import { OrderStatus } from '@/api/client/order/enum';
import { OrderDto } from '@/api/client/order/res.dto';
import { createPayment, getPaymentStatus } from '@/api/payment';
import { PaymentMethod, PaymentStatus } from '@/api/payment/enum';
import { Modal, QRCode, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { weichat } from './base64';
import './index.scss';

export type PaymentQRDiaProps = {
  open?: boolean;
  order: OrderDto;
  onCancel?: () => void;
  title?: string;
  payMethod?: PaymentMethod;
  onOk: () => void;
};

const PaymentQRDia = (props: PaymentQRDiaProps) => {
  const {
    title = '请扫码支付',
    open = true,
    onCancel,
    order,
    onOk,
    payMethod = PaymentMethod.WECHAT,
  } = props;
  const [QRvalue, setQRvalue] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [paySuccess, setSuccess] = useState(false);

  useEffect(() => {
    // 如果不是 待支付状态的订单直接返回
    if (order.status !== OrderStatus.PENDING_PAYMENT) return;

    // 已经创建过支付，直接使用 二维码
    if (order.paymentNo) {
      setQRvalue(order.paymentNo);
      setPaymentId(order.paymentNo);
    } else {
      // 创建支付
      createPayment({ orderId: order.id, payMethod }).then(data => {
        setQRvalue(data.codeUrl);
        setPaymentId(String(data.id));
      });
    }
  }, [order, payMethod]);

  //   查询支付状态
  useEffect(() => {
    // 如果不是 待支付状态的订单直接返回
    if (order.status !== OrderStatus.PENDING_PAYMENT) return;
    if (!paymentId) return;

    const timeId = setInterval(async () => {
      const data = await getPaymentStatus(Number(paymentId));
      if (data.status === PaymentStatus.SUCCESS) {
        clearInterval(timeId);
        setSuccess(true);
      }
    }, 2000);

    return () => {
      clearInterval(timeId);
    };
  }, [paymentId, order.status]);

  const renderContent = () => {
    if (paySuccess) {
      return '支付成功';
    }
    if (QRvalue) {
      return (
        <QRCode
          errorLevel="H"
          value={QRvalue}
          // icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
          icon={weichat}
        />
      );
    } else {
      return (
        <div className="loading-container">
          <Spin />
          <p>加载中</p>
        </div>
      );
    }
  };

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      cancelText="取消"
      destroyOnClose
    >
      <div className="payment-QR-dia">{renderContent()}</div>
    </Modal>
  );
};

export { PaymentQRDia };
