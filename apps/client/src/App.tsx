import '@/assets/scss/reset.scss';
import '@/assets/scss/theme-css-variables.scss';
import { ConfigProvider, ConfigProviderProps } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import 'normalize.css';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import store from './store';
import { ShowDialogProvider } from './utils/show-dialog';

type Locale = ConfigProviderProps['locale'];

function App() {
  const [locale] = useState<Locale>(zhCN);

  return (
    <ConfigProvider locale={locale}>
      <Provider store={store}>
        <ShowDialogProvider>
          <RouterProvider router={router} />
        </ShowDialogProvider>
      </Provider>
    </ConfigProvider>
  );
}

export default App;
