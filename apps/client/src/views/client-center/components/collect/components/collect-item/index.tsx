import { FavoriteItemDto } from '@/api/behaviour/favorite/res.dto';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Image, Space, Typography } from 'antd';
import dayjs from 'dayjs';
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

  return (
    <Card
      className="collect-item"
      hoverable
      cover={<Image src={mainImage} alt={title} height={200} preview={false} />}
    >
      <Space direction="vertical" size="small" className="product-info">
        <Title level={5} ellipsis={{ rows: 2 }}>
          {title}
        </Title>
        <Text type="danger" strong>
          ¥{price}
        </Text>
        <Text type="secondary" className="collect-time">
          收藏于：{dayjs(favoriteTime).format('YYYY-MM-DD HH:mm')}
        </Text>
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onCancel(id)}>
          取消收藏
        </Button>
      </Space>
    </Card>
  );
};
