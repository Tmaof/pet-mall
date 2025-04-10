import { ShowDialogProvider } from '@/utils/show-dialog';
import { Header } from '@/views/index/components/Header';
import { Outlet } from 'react-router-dom';
import './index.scss';

const RootLayout = () => {
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
