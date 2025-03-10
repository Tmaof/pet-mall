import { ProductDto, SALE_STATUS } from '@/api/index.type';
import { Image, Skeleton, Tag } from 'antd';
import { FC } from 'react';
import './index.scss';

interface Props {
  data: ProductDto | null;
  loading?: boolean;
}

const ProductInfo: FC<Props> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="product-info">
        <div className="product-image">
          <Skeleton.Image active className="image-skeleton" />
        </div>
        <div className="product-details">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="product-info">
      <div className="product-image">
        <Image src={data.mainImage} alt={data.title} />
        {data.stock <= 0 && <div className="sold-out">已售罄</div>}
      </div>
      <div className="product-details">
        <h1 className="product-title">{data.title}</h1>
        <div className="product-meta">
          <div className="product-price">
            <span className="currency">¥</span>
            <span className="amount">{data.price}</span>
          </div>
          <div className="product-stock">
            库存: <span>{data.stock}</span>
          </div>
          <div className="product-status">
            状态:
            <span className={data.isOnSale === SALE_STATUS.sale ? 'on-sale' : 'off-sale'}>
              {data.isOnSale === SALE_STATUS.sale ? '在售' : '下架'}
            </span>
          </div>
        </div>
        <div className="product-tags">
          {data.tags?.map(tag => (
            <Tag key={tag.id} color="var(--theme-primary)">
              {tag.name}
            </Tag>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ProductInfo };
