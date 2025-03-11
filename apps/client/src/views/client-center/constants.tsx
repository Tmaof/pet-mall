import { Address } from './components/address';
import { Cart } from './components/cart';
import { Collect } from './components/collect';
import { Comment } from './components/comment';
import { Order } from './components/order';
import { Profile } from './components/profile';
import {
  UserOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  StarOutlined,
  CommentOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

export const CLIENT_CENTER_TABS = [
  {
    key: 'profile',
    label: '个人信息',
    icon: <UserOutlined />,
    children: <Profile />,
  },
  {
    key: 'cart',
    label: '购物车',
    icon: <ShoppingCartOutlined />,
    children: <Cart />,
  },
  {
    key: 'order',
    label: '订单',
    icon: <OrderedListOutlined />,
    children: <Order />,
  },
  {
    key: 'collect',
    label: '收藏',
    icon: <StarOutlined />,
    children: <Collect />,
  },
  {
    key: 'comment',
    label: '评价',
    icon: <CommentOutlined />,
    children: <Comment />,
  },
  {
    key: 'address',
    label: '地址',
    icon: <EnvironmentOutlined />,
    children: <Address />,
  },
];
