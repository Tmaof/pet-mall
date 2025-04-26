import { cancelCollectGoods, getFavoriteList } from '@/api/behaviour/favorite';
import { FavoriteItemDto } from '@/api/behaviour/favorite/res.dto';
import { Empty, Pagination, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { CollectItem } from './components/collect-item';
import './index.scss';

/** 收藏列表组件 */
export const Collect = () => {
  const [data, setData] = useState<{
    items: FavoriteItemDto[];
    total: number;
  }>({
    items: [],
    total: 0,
  });
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  /** 获取收藏列表 */
  const fetchFavoriteList = useCallback(async () => {
    const res = await getFavoriteList({
      page: pagination.current,
      pageSize: pagination.pageSize,
    });
    setData(res);
  }, [pagination]);

  /** 取消收藏 */
  const handleCancel = useCallback(
    async (productId: number) => {
      try {
        await cancelCollectGoods(productId);
        message.success('取消收藏成功');
        fetchFavoriteList();
      } catch (error) {
        console.error('取消收藏失败:', error);
      }
    },
    [fetchFavoriteList]
  );

  /** 获取收藏列表:
   * 1. 组件加载时获取收藏列表
   * 2. 分页变化时重新获取收藏列表
   *
   */
  useEffect(() => {
    fetchFavoriteList();
  }, [fetchFavoriteList]);

  /** 分页变化 */
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPagination({ current: page, pageSize });
  }, []);

  if (!data || !data.items) {
    return (
      <div className="collect-container">
        <Empty description="暂无收藏商品" />
      </div>
    );
  }

  return (
    <div className="collect-container">
      {data.items.length > 0 ? (
        <>
          <div className="product-list">
            {data.items.map(item => (
              <CollectItem key={item.id} product={item} onCancel={handleCancel} />
            ))}
          </div>
          <div className="pagination-container">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={data.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              showTotal={total => `共 ${total} 条`}
            />
          </div>
        </>
      ) : (
        <Empty description="暂无收藏商品" />
      )}
    </div>
  );
};
