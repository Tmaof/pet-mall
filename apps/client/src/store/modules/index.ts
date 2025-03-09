// 首页模块

import { getHomePageData } from '@/api/home';
import { HomePageResDto } from '@/api/home/res.dto';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface IndexState {
  /** 首页数据 */
  homeData: HomePageResDto | null;
  /** 加载状态 */
  loading: boolean;
}

const initialState: IndexState = {
  homeData: null,
  loading: false,
};

/** 获取首页数据 */
export const fetchHomeData = createAsyncThunk('index/fetchHomeData', async () => {
  const data = await getHomePageData();
  return data;
});

const indexSlice = createSlice({
  name: 'index',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchHomeData.pending, state => {
        state.loading = true;
      })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchHomeData.rejected, state => {
        state.loading = false;
      });
  },
});

export default indexSlice.reducer;
