import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CLIENT_CENTER_TABS } from './constants';
import './index.scss';

const ClientCenter = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [valueTab, setValueTab] = useState<string>('profile');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 监听query参数的tabKey
  useEffect(() => {
    const tabKey = searchParams.get('tabKey');
    if (tabKey) {
      setValueTab(tabKey);
    }
  }, [searchParams]);

  const handleTabChange = (key: string) => {
    setValueTab(key);
    navigate(`/client-center?tabKey=${key}`);
  };

  return (
    <div className="client-center-page">
      <div className="client-center-container">
        <div className={classNames('user-info-panel', { collapsed })}>
          <div className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
          <div className="user-info-content">
            <div className="user-avatar">
              <UserOutlined />
            </div>
            <h2 className="username">用户名</h2>
            <p className="user-desc">这里是用户简介</p>
          </div>
        </div>

        <div className="content-panel">
          <Tabs
            activeKey={valueTab}
            onChange={handleTabChange}
            tabPosition="left"
            items={CLIENT_CENTER_TABS.map(tab => ({
              label: (
                <div className="tab-label">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
              ),
              key: tab.key,
              children: <div className="tab-content">{tab.children}</div>,
            }))}
          />
        </div>
      </div>
    </div>
  );
};

export { ClientCenter };
