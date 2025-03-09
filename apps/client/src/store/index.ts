import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './modules/client';

const store = configureStore({
  reducer: {
    // 注册子模块，名字是client
    client: clientReducer,
  },
});

// 导出store
export default store;
