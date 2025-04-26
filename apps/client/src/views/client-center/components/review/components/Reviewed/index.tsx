import { getReviewedProducts } from '@/api/behaviour/review';
import { ReviewedProductsDto } from '@/api/behaviour/review/res-dto';
import { Card, Image, Pagination, Rate, Typography } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import './index.scss';

const { Text } = Typography;

/** 已评价列表 */
export const ReviewedList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ReviewedProductsDto>({
    list: [],
    total: 0,
    page: 1,
    pageSize: 1,
  });

  const fetchData = async (page: number = 1, pageSize = 1) => {
    setLoading(true);
    try {
      const res = await getReviewedProducts({
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

  const handlePageChange = (page: number, pageSize: number) => {
    fetchData(page, pageSize);
  };

  return (
    <div className="reviewed-list-container">
      {data.list.length === 0 && !loading && <div className="empty-tip">暂无已评价商品</div>}
      {data.list.map(item => (
        <Card key={item.orderItemId} className="reviewed-item">
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
                <Text type="secondary">商品ID：{item.id}</Text>
                <Text type="secondary">订单号：{item.orderId}</Text>
                <Text type="secondary">购买数量：{item.quantity}</Text>
                <Text type="secondary">
                  评分：
                  <Rate className="reviewed-rate" count={5} value={item.rating} disabled />
                </Text>
                <Text type="secondary">
                  评价时间：{dayjs(item.reviewTime).format('YYYY-MM-DD HH:mm:ss')}
                </Text>
              </div>
            </div>
          </div>
          <div className="review-action"></div>
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
