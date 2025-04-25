import { getProductReviewCount } from '@/api/behaviour/review';
import { MessageOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
import { FC, useEffect, useState } from 'react';
import { ProductDescription } from './components/ProductDescription';
import { ProductInfo } from './components/ProductInfo';
import { ReviewDrawer } from './components/ReviewDrawer';
import { useProductDetails } from './hooks/useProductDetails';
import './index.scss';

const Details: FC = () => {
  const { product, loading } = useProductDetails();
  const [openReviewDrawer, setOpenReviewDrawer] = useState(false);

  const [productReviewCount, setProductReviewCount] = useState(0);

  useEffect(() => {
    if (!product?.id) return;
    getProductReviewCount(product.id).then(res => {
      setProductReviewCount(res);
    });
  }, [product?.id]);

  return (
    <div className="details-page">
      <div className="details-content">
        <ProductInfo data={product} loading={loading} />
        <ProductDescription description={product?.description} loading={loading} />
        {/* 评论区 */}
        <ReviewDrawer
          productId={product?.id}
          open={openReviewDrawer}
          onClose={() => setOpenReviewDrawer(false)}
        />
        {/* 左侧浮动按钮 */}
        <FloatButton.Group shape="circle" className="float-button-group">
          <FloatButton
            badge={{ count: productReviewCount }}
            icon={<MessageOutlined />}
            onClick={() => setOpenReviewDrawer(true)}
          />
          <FloatButton.BackTop visibilityHeight={0} />
        </FloatButton.Group>
      </div>
    </div>
  );
};

export { Details };
