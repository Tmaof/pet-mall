import { getAddressList, getRegionTree } from '@/api/client/address';
import { AddressDto, RegionResDto } from '@/api/client/address/res.dto';
import { TOKEN_KEY } from '@/constants/key';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch } from '../index';

const clientSlice = createSlice({
  /** 模块名称独一无二 */
  name: 'client',
  /** 初始化数据 */
  initialState: {
    // 从localStorage中获取token
    token: localStorage.getItem(TOKEN_KEY) || '',
    /** 客户地址列表 */
    clientAddresses: [] as AddressDto[],
    /** 省市区地区列表 */
    regionTree: [] as RegionResDto['list'],
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
    /** 设置省市区地区列表 */
    setRegionTree: (state, action) => {
      state.regionTree = action.payload;
    },
  },
});

// 解构出action-Creater函数
export const { setToken, setClientAddresses, setRegionTree } = clientSlice.actions;

/** 获取客户地址列表 */
export const fetchClientAddresses = () => {
  return async (dispatch: AppDispatch) => {
    const { list } = await getAddressList();
    dispatch(setClientAddresses(list));
    return list;
  };
};

/** 获取省市区地区列表 */
export const fetchRegionTree = () => {
  return async (dispatch: AppDispatch) => {
    const { list } = await getRegionTree();
    dispatch(setRegionTree(list));
    return list;
  };
};

// 导出reducer
export default clientSlice.reducer;
