import { ProductDto, SALE_STATUS } from '@/api/index.type';
import { Image, Tag } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';
import { fallback } from './constants';

interface Props {
  data: ProductDto;
}

const ProductCard: FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  if (data.isOnSale === SALE_STATUS.stop) return null;

  return (
    <div className="product-card" onClick={() => navigate(`/details/${data.id}`)}>
      <div className="product-image">
        <Image fallback={fallback} preview={false} src={data.mainImage} alt={data.title} />
        {data.stock <= 0 && <div className="sold-out">已售罄</div>}
      </div>
      <div className="product-info">
        <h3 className="product-title">{data.title}</h3>
        <div className="product-meta">
          <div className="product-price">
            <span className="currency">¥</span>
            <span className="amount">{data.price}</span>
          </div>
          <div className="product-tags">
            {data.tags?.slice(0, 2).map(tag => (
              <Tag key={tag.id} color="var(--theme-primary)">
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductCard };
