import { FavoriteItemDto } from '@/api/behaviour/favorite/res.dto';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const { Title, Text } = Typography;

interface Props {
  /** 商品信息 */
  product: FavoriteItemDto;
  /** 取消收藏回调 */
  onCancel: (productId: number) => void;
}

/** 商品卡片组件 */
export const CollectItem = ({ product, onCancel }: Props) => {
  const { id, title, price, mainImage, favoriteTime } = product;
  const navigate = useNavigate();

  const onClickTitle = useCallback(() => {
    // 跳转到商品详情页
    navigate(`/details/${id}`);
  }, [id, navigate]);

  return (
    <Card
      className="collect-item"
      hoverable
      cover={<Image src={mainImage} alt={title} height={100} preview={false} />}
    >
      <Space direction="vertical" size="small" className="collect-product-info">
        <Title level={5} ellipsis={{ rows: 2 }} onClick={onClickTitle}>
          {title}
        </Title>
        <Text type="danger" strong>
          ¥{price}
        </Text>
        <Text type="secondary" className="collect-time">
          收藏于：{dayjs(favoriteTime).format('YYYY-MM-DD HH:mm')}
        </Text>
        <div className="cancel-collect">
          <Button
            className="cancel-collect-btn"
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onCancel(id)}
          >
            取消
          </Button>
        </div>
      </Space>
    </Card>
  );
};
