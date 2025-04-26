import { ShowDialogProvider } from '@/utils/show-dialog';
import { Header } from '@/views/index/components/Header';
import { Outlet, useNavigate } from 'react-router-dom';
import './index.scss';
import { eventBus } from '@/utils/event-bus';
import { message } from 'antd';
import { AxiosError } from 'axios';
import { useEffect } from 'react';

const RootLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    function handleApiUnauthorized(error: AxiosError) {
      const url = error.config?.url;
      const whiteList = ['/cart/count'];
      if (url && whiteList.includes(url)) {
        return;
      }
      message.error('请先登录');
      navigate('/signin');
    }
    eventBus.on('api-unauthorized', handleApiUnauthorized);

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
