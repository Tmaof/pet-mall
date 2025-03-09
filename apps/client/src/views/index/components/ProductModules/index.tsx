import { HomePageResDto } from '@/api/home/res.dto';
import { FC } from 'react';
import { ProductCard } from '../ProductCard';
import { ProductSkeleton } from './components/product-skeleton';
import './index.scss';

interface Props {
  data?: HomePageResDto['modules'];
  loading?: boolean;
}

const ProductModules: FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="product-modules">
        <ProductSkeleton count={4} />
        <ProductSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="product-modules">
      {data?.map(module => (
        <div key={module.type} className="module-section">
          <h2 className="module-title">{module.name}</h2>
          <div className="product-grid">
            {module.products.map(product => (
              <ProductCard key={product.id} data={product} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { ProductModules };
