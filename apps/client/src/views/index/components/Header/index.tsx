import AiSearchImg from '@/assets/svg/ai-search-img.svg';
import { useAiImgSearch } from '@/components/AiImgSearch/hook';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchCartCount } from '@/store/modules/client';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Dropdown } from 'antd';
import { FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userMenuItems } from './constants';
import './index.scss';

const Header: FC = () => {
  const navigate = useNavigate();
  const cartCount = useAppSelector(state => state.client.cartCount);
  const dispatch = useAppDispatch();

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = userMenuItems.find(item => item.key === key);
    if (!item) return;
    navigate(item.path);
  };

  // 初始化 购物车数量
  useEffect(() => {
    dispatch(fetchCartCount());
  }, [dispatch]);

  const { showAiImgSearch } = useAiImgSearch();

  return (
    <header className="index-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          Mall
        </div>
        <div className="header-right">
          <img
            src={AiSearchImg}
            alt="ai-search"
            className="icon-btn"
            onClick={() => showAiImgSearch({ open: true, onCancel() {} })}
          />
          <Badge count={cartCount} size="small">
            <ShoppingCartOutlined
              className="icon-btn"
              onClick={() => navigate('/client-center?tabKey=cart')}
            />
          </Badge>
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleMenuClick }}
            placement="bottomRight"
            trigger={['hover']}
          >
            <UserOutlined className="icon-btn" />
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export { Header };
