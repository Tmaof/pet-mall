import { ProductDto } from '@/api/index.type';
import { errImgFallback } from '@/constants';
import { Form, Image, InputNumber, Modal, Typography } from 'antd';
import { FC, useEffect, useState } from 'react';
import './index.scss';

interface Props {
  open: boolean;
  product: ProductDto;
  onOk: (values: { productId: number; quantity: number }) => void;
  onCancel: () => void;
  okText?: string;
  title?: string;
}

const BuyDialog: FC<Props> = ({
  open,
  product,
  onOk,
  onCancel,
  okText = '确认购买',
  title = '确认购买信息',
}) => {
  const [form] = Form.useForm();
  const [total, setTotal] = useState<string>('0.00');

  /** 计算总价 */
  const calculateTotal = (quantity: number = 1) => {
    return (product.price * quantity).toFixed(2);
  };

  /** 处理数量变化 */
  const handleQuantityChange = (value: number | null) => {
    setTotal(calculateTotal(value || 1));
  };

  /** 处理表单提交 */
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onOk({
        productId: product.id,
        quantity: values.quantity,
      });
    } catch (error) {
      console.error('Validate Failed:', error);
    }
  };

  /** 重置表单和总价 */
  useEffect(() => {
    if (open) {
      const initialQuantity = 1;
      form.setFieldsValue({ quantity: initialQuantity });
      setTotal(calculateTotal(initialQuantity));
    }
  }, [open, form, product.price]);

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText={okText}
      cancelText="取消"
      destroyOnClose
    >
      <div className="buy-dialog">
        <div className="product-info">
          <Image fallback={errImgFallback} src={product.mainImage} alt={product.title} />
          <div className="info">
            <Typography.Title level={5} ellipsis={{ rows: 2 }}>
              {product.title}
            </Typography.Title>
            <div className="price">
              <span className="currency">¥</span>
              <span className="amount">{product.price}</span>
            </div>
          </div>
        </div>
        <Form form={form} layout="vertical">
          <Form.Item
            label="购买数量"
            name="quantity"
            rules={[
              { required: true, message: '请输入购买数量' },
              {
                type: 'number',
                min: 1,
                message: '购买数量必须大于0',
              },
              {
                type: 'number',
                max: product.stock,
                message: `购买数量不能超过库存数量(${product.stock})`,
              },
            ]}
          >
            <InputNumber
              min={1}
              max={product.stock}
              precision={0}
              onChange={handleQuantityChange}
            />
          </Form.Item>
        </Form>
        <div className="total">
          <span className="label">总计:</span>
          <span className="currency">¥</span>
          <span className="amount">{total}</span>
        </div>
      </div>
    </Modal>
  );
};

export { BuyDialog };
