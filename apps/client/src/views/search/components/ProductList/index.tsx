import { ProductDto } from '@/api/index.type';
import { ProductCard } from '@/views/index/components/ProductCard';
import { Empty, Pagination } from 'antd';
import { FC } from 'react';
import { ProductSkeleton } from '@/views/index/components/product-skeleton';
import './index.scss';

interface Props {
  data: ProductDto[];
  loading?: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
}

const ProductList: FC<Props> = ({ data, loading, pagination }) => {
  if (loading) {
    return (
      <div className="product-list">
        <ProductSkeleton isShowTitle={false} count={pagination.pageSize} />
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="product-list">
        <Empty description="暂无商品" />
      </div>
    );
  }

  return (
    <div className="product-list">
      <div className="product-grid">
        {data.map(product => (
          <ProductCard key={product.id} data={product} />
        ))}
      </div>
      <div className="pagination">
        <Pagination
          {...pagination}
          showSizeChanger
          showQuickJumper
          showTotal={total => `共 ${total} 个商品`}
        />
      </div>
    </div>
  );
};

export { ProductList };
