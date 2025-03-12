import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge, Dropdown } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { userMenuItems } from './constants';
import './index.scss';

const Header: FC = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }: { key: string }) => {
    const item = userMenuItems.find(item => item.key === key);
    if (!item) return;
    navigate(item.path);
  };

  return (
    <header className="index-header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          Mall
        </div>
        <div className="header-right">
          <Badge count={5} size="small">
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
