import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import clientReducer from './modules/client';
import indexReducer from './modules/index';

const store = configureStore({
  reducer: {
    // 注册子模块，名字是client
    client: clientReducer,
    index: indexReducer,
  },
});

// 导出store
export default store;

/** 根状态类型 */
export type RootState = ReturnType<typeof store.getState>;
/** 派发类型 */
export type AppDispatch = typeof store.dispatch;

/** 使用dispatch */
export const useAppDispatch = () => useDispatch<AppDispatch>();
/** 使用selector */
export const useAppSelector = <T>(fn: (state: RootState) => T) => useSelector<RootState, T>(fn);
