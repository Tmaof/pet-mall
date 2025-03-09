import { ProductDto } from '@/api/index.type';
import { Tag } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

interface Props {
  data: ProductDto;
}

const ProductCard: FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${data.id}`)}>
      <div className="product-image">
        <img src={data.mainImage} alt={data.title} />
        {!data.isOnSale && <div className="sold-out">已售罄</div>}
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
