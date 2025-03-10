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

type Locale = ConfigProviderProps['locale'];

function App() {
  const [locale] = useState<Locale>(zhCN);
  return (
    <ConfigProvider locale={locale}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </ConfigProvider>
  );
}

export default App;
