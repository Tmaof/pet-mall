import { getAddressList } from '@/api/client/address';
import { TOKEN_KEY } from '@/constants/key';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../index';
import { AddressDto } from '@/api/client/address/res.dto';

const clientSlice = createSlice({
  /** 模块名称独一无二 */
  name: 'client',
  /** 初始化数据 */
  initialState: {
    // 从localStorage中获取token
    token: localStorage.getItem(TOKEN_KEY) || '',
    /** 客户地址列表 */
    clientAddresses: [] as AddressDto[],
  },
  /** 同步修改数据方法 */
  reducers: {
    /** 设置token */
    setToken: (state, action) => {
      state.token = action.payload;
      // 将token存储到localStorage
      localStorage.setItem(TOKEN_KEY, action.payload);
    },
    /** 设置客户地址列表 */
    setClientAddresses: (state, action) => {
      state.clientAddresses = action.payload;
    },
  },
});

// 解构出action-Creater函数
export const { setToken, setClientAddresses } = clientSlice.actions;

/** 获取客户地址列表 */
export const fetchClientAddresses = () => {
  return async (dispatch: AppDispatch) => {
    const { list } = await getAddressList();
    dispatch(setClientAddresses(list));
    return list;
  };
};

// 导出reducer
export default clientSlice.reducer;
