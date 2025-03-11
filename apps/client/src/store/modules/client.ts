import { TOKEN_KEY } from '@/constants/key';
import { createSlice } from '@reduxjs/toolkit';

const clientSlice = createSlice({
  /** 模块名称独一无二 */
  name: 'client',
  /** 初始化数据 */
  initialState: {
    // 从localStorage中获取token
    token: localStorage.getItem(TOKEN_KEY) || '',
  },
  /** 同步修改数据方法 */
  reducers: {
    /** 设置token */
    setToken: (state, action) => {
      state.token = action.payload;
      // 将token存储到localStorage
      localStorage.setItem(TOKEN_KEY, action.payload);
    },
  },
});

// 解构出action-Creater函数
export const { setToken } = clientSlice.actions;

// 导出reducer
export default clientSlice.reducer;
