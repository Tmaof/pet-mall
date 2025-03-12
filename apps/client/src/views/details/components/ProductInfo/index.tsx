import { ProductDto, SALE_STATUS } from '@/api/index.type';
import { useBuyDialog } from '@/components/BuyDialog/hook';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchClientAddresses } from '@/store/modules/client';
import { HeartFilled, HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Image, Skeleton, Tag, message } from 'antd';
import { FC, useState } from 'react';
import './index.scss';

interface Props {
  data: ProductDto | null;
  loading?: boolean;
}

const ProductInfo: FC<Props> = ({ data, loading }) => {
  const [isCollected, setIsCollected] = useState(false);
  const { clientAddresses } = useAppSelector(state => state.client);
  const dispatch = useAppDispatch();
  const { showBuyDialog } = useBuyDialog();

  /** 处理添加购物车 */
  const handleAddToCart = () => {
    message.success('已添加到购物车');
  };

  /** 处理立即购买 */
  const handleBuyNow = async () => {
    let list = clientAddresses;
    // 如果没有地址列表，可能没有获取过，先获取地址列表
    if (list.length === 0) {
      list = await dispatch(fetchClientAddresses());
    }

    showBuyDialog({
      open: true,
      product: data!,
      addressList: list,
      onOk: handleBuyConfirm,
      onCancel: () => {},
    });
  };

  /** 处理购买确认 */
  const handleBuyConfirm = (values: { productId: number; quantity: number }) => {
    console.log('购买信息:', values);
    message.success('购买成功!');
  };

  /** 处理收藏切换 */
  const handleCollectToggle = () => {
    setIsCollected(prev => !prev);
    message.success(isCollected ? '已取消收藏' : '收藏成功');
  };

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

  const isOutOfStock = data.stock <= 0;
  const isOffSale = data.isOnSale === SALE_STATUS.stop;
  const disableActions = isOutOfStock || isOffSale;

  return (
    <>
      <div className="product-info">
        <div className="product-image">
          <Image src={data.mainImage} alt={data.title} />
          {isOutOfStock && <div className="sold-out">已售罄</div>}
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
          <div className="product-actions">
            <Button
              type="primary"
              size="large"
              icon={<ShoppingCartOutlined />}
              onClick={handleAddToCart}
              disabled={disableActions}
              className="action-btn cart-btn"
            >
              加入购物车
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleBuyNow}
              disabled={disableActions}
              className="action-btn buy-btn"
            >
              立即购买
            </Button>
            <Button
              type="text"
              size="large"
              icon={isCollected ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
              onClick={handleCollectToggle}
              className={`collect-btn ${isCollected ? 'collected' : ''}`}
            />
          </div>
          {disableActions && (
            <div className="action-tips">{isOutOfStock ? '该商品已售罄' : '该商品已下架'}</div>
          )}
        </div>
      </div>
    </>
  );
};

export { ProductInfo };
