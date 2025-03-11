import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { Tabs } from 'antd';
import classNames from 'classnames';
import { useState } from 'react';
import { CLIENT_CENTER_TABS } from './constants';
import './index.scss';

const ClientCenter = () => {
  const [collapsed, setCollapsed] = useState(false);

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
