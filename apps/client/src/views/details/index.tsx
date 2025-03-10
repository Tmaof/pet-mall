import { FC } from 'react';
import { ProductDescription } from './components/ProductDescription';
import { ProductInfo } from './components/ProductInfo';
import { useProductDetails } from './hooks/useProductDetails';
import './index.scss';

const Details: FC = () => {
  const { product, loading } = useProductDetails();

  return (
    <div className="details-page">
      <div className="details-content">
        <ProductInfo data={product} loading={loading} />
        <ProductDescription description={product?.description} loading={loading} />
      </div>
    </div>
  );
};

export { Details };
