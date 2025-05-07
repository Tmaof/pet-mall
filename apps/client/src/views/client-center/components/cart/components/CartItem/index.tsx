import type { CartItemDto } from '@/api/behaviour/cart/res.dto';
import { SALE_STATUS } from '@/api/index.type';
import { isDisabledOfProduct } from '@/utils';
import { Card, Image, InputNumber, Space, Tag, Typography } from 'antd';
import { useMemo } from 'react';
import './index.scss';
import dayjs from 'dayjs';

const { Text } = Typography;

interface CartItemProps {
  item: CartItemDto;
  onQuantityChange: (cartItemId: number, quantity: number) => void;
}

/**
 * 购物车项组件
 */
export const CartItem = ({ item, onQuantityChange }: CartItemProps) => {
  const { id, product, count, createdAt } = item;
  const { mainImage, title, price, stock, isOnSale } = product;
  const isDisabled = isDisabledOfProduct(product);

  const disableText = useMemo(() => {
    // TODO: 类型不匹配报错
    // @ts-expect-error 类型不匹配报错
    if (isOnSale === SALE_STATUS.stop) {
      return '商品已下架';
    }
    if (stock <= 0) {
      return '库存不足';
    }
  }, [isOnSale, stock]);

  return (
    <Card className="cart-item">
      <Space size="large" align="center">
        <Image
          className="item-img"
          src={mainImage}
          alt={title}
          width={100}
          height={100}
          preview={false}
        />
        <Space direction="vertical" size="small">
          {isDisabled && <Tag color="error">{disableText}</Tag>}
          <Text strong>{title}</Text>
          <Space>
            <Text type="secondary">单价：</Text>
            <Text type="danger">¥{price}</Text>
          </Space>
          <Space>
            <Text type="secondary">库存：</Text>
            <Text>{stock}</Text>
          </Space>
          <InputNumber
            min={1}
            max={stock}
            value={count}
            onChange={value => onQuantityChange(id, value || 1)}
            disabled={isDisabled}
          />
          <Text type="secondary">加购时间：{dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss')}</Text>
        </Space>
      </Space>
    </Card>
  );
};
