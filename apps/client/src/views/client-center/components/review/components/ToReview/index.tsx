import { getPendingReviewProducts, publishProductReview } from '@/api/behaviour/review';
import { PendingReviewProductsDto } from '@/api/behaviour/review/res-dto';
import { Button, Card, Image, message, Pagination, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useReviewProductDia } from '../ReviewProductDia/hook';
import './index.scss';

const { Text } = Typography;

/** 待评价列表 */
export const ToReviewList = () => {
  const { showReviewProductDia } = useReviewProductDia();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PendingReviewProductsDto>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 1,
  });

  const fetchData = async (page: number = 1, pageSize = 1) => {
    setLoading(true);
    try {
      const res = await getPendingReviewProducts({
        page,
        pageSize,
      });
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /** 点击去评价 */
  const handleReview = (orderItemId: number, productId: number) => {
    showReviewProductDia({
      open: true,
      onSubmit: async data => {
        await publishProductReview({
          orderItemId,
          productId,
          ...data,
        });
        message.success('评价成功');
        fetchData();
      },
    });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  return (
    <div className="to-review-list">
      {data.list.length === 0 && !loading && <div className="empty-tip">暂无待评价商品</div>}
      {data.list.map(item => (
        <Card key={item.orderItemId} className="to-review-item">
          <div className="product-info">
            <Image
              className="product-img"
              src={item.mainImage}
              alt={item.title}
              width={100}
              height={100}
              preview={false}
            />
            <div className="product-detail">
              <Text strong>{item.title}</Text>
              <div className="product-meta">
                <Text type="secondary">订单号：{item.orderId}</Text>
                <Text type="secondary">购买数量：{item.quantity}</Text>
                <Text type="secondary">
                  购买时间：{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </div>
            </div>
          </div>
          <div className="review-action">
            <Button type="primary" onClick={() => handleReview(item.orderItemId, item.id)}>
              去评价
            </Button>
          </div>
        </Card>
      ))}
      {data.total > 0 && (
        <div className="pagination">
          <Pagination
            current={data.page}
            pageSize={data.pageSize}
            total={data.total}
            onChange={handlePageChange}
            showSizeChanger
            showQuickJumper
            showTotal={total => `共 ${total} 条`}
          />
        </div>
      )}
    </div>
  );
};
