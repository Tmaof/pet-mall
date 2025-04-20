import { cancelCollectGoods, collectGoods, fetchIsCollected } from '@/api/behaviour/favorite';
import { message } from 'antd';
import { useEffect, useState } from 'react';

export const useCollect = (productId: number) => {
  const [isCollected, setIsCollected] = useState(false);

  /** 处理收藏切换 */
  const handleCollectToggle = async () => {
    if (!productId) return;

    // 前置判断：如果没有登录，提示用户登录

    if (isCollected) {
      cancelCollectGoods(productId);
      setIsCollected(false);
      message.success('已取消收藏');
      return;
    }
    await collectGoods(productId);
    setIsCollected(true);
    message.success('收藏成功');
  };

  // 初始化收藏状态
  useEffect(() => {
    if (!productId) return;
    fetchIsCollected(productId).then(res => {
      setIsCollected(res);
    });
  }, [productId]);

  return {
    isCollected,
    handleCollectToggle,
  };
};
