import { useAppDispatch } from '@/store';
import { setToken } from '@/store/modules/client';
import { useNavigate } from 'react-router-dom';

export const useUserMenuItems = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  /** 用户菜单项 */
  const userMenuItems = [
    {
      key: 'profile',
      label: '个人中心',
      path: '/client-center?tabKey=profile',
    },
    {
      key: 'orders',
      label: '我的订单',
      path: '/client-center?tabKey=order',
    },
    {
      key: 'addresses',
      label: '我的地址',
      path: '/client-center?tabKey=address',
    },
    {
      key: 'cart',
      label: '购物车',
      path: '/client-center?tabKey=cart',
    },
    {
      key: 'collect',
      label: '我的收藏',
      path: '/client-center?tabKey=collect',
    },
    {
      key: 'comments',
      label: '我的评论',
      path: '/client-center?tabKey=comment',
    },
    {
      key: 'logout',
      label: '退出登录',
      onClick: () => {
        dispatch(setToken(''));
        navigate('/');
      },
    },
  ];

  return userMenuItems;
};
