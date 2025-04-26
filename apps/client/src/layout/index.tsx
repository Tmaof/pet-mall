import { debounce } from '@/utils';
import { eventBus } from '@/utils/event-bus';
import { ShowDialogProvider } from '@/utils/show-dialog';
import { Header } from '@/views/index/components/Header';
import { message } from 'antd';
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './index.scss';

const RootLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    function handleApiUnauthorized(error: AxiosError) {
      const url = error.config?.url;
      const whiteList = ['cart/count', 'favorite/item', 'reviews/product', 'reviews/product/count'];
      if (url && whiteList.find(item => url.includes(item))) {
        return;
      }
      message.error('请先登录');
      setTimeout(() => {
        navigate('/signin');
      }, 1500);
    }
    // 同一时间，额可能有多个api接口触发401，使用防抖来处理
    eventBus.on('api-unauthorized', debounce(handleApiUnauthorized, 500));

    return () => {
      eventBus.off('api-unauthorized', handleApiUnauthorized);
    };
  }, [navigate]);

  return (
    <div className="root-layout">
      <ShowDialogProvider>
        <Header />
        <Outlet />
      </ShowDialogProvider>
    </div>
  );
};

export { RootLayout };
