import { Button, Space, Typography } from 'antd';
import './index.scss';

const { Text } = Typography;

interface CartFooterProps {
  selectedCount: number;
  totalPrice: number;
  onDelete: () => void;
  onBuy: () => void;
}

/**
 * 购物车底部组件
 */
export const ActionBar = ({ selectedCount, totalPrice, onDelete, onBuy }: CartFooterProps) => {
  return (
    <div className="action-bar">
      <Space size="large">
        <Button type="primary" size="large" disabled={selectedCount === 0} onClick={onBuy}>
          立即购买
        </Button>
        <Button type="primary" danger disabled={selectedCount === 0} onClick={onDelete}>
          删除选中
        </Button>
        <Space>
          <Text>已选择 {selectedCount} 件商品</Text>
          <Text strong>合计：</Text>
          <Text type="danger" strong>
            ¥{totalPrice.toFixed(2)}
          </Text>
        </Space>
      </Space>
    </div>
  );
};
