import { Skeleton, Space } from 'antd';
import { FC } from 'react';
import './index.scss';

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton: FC<ProductSkeletonProps> = ({ count = 4 }) => {
  return (
    <div className="product-skeleton-container">
      <Skeleton.Input
        active
        size="large"
        className="module-title-skeleton"
        style={{ width: '180px', height: '32px', marginBottom: '24px' }}
      />
      <div className="product-skeleton-grid">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="product-skeleton-item">
            <Skeleton.Image active className="product-image-skeleton" />
            <Space direction="vertical" style={{ width: '100%' }} size={12}>
              <Skeleton.Input active style={{ width: '80%', height: '16px' }} size="small" />
              <Skeleton.Input active style={{ width: '40%', height: '24px' }} size="small" />
            </Space>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProductSkeleton };
