import request from '@/utils/request';
import { SearchSuggestReqDto } from './req.dto';
import { GetCategoryTreeResDto, HomePageResDto, SearchSuggestResDto } from './res.dto';

/** 获取搜索建议 */
export const getSearchSuggestions = (params: SearchSuggestReqDto) =>
  request<SearchSuggestResDto>({
    url: '/search/suggest',
    method: 'GET',
    params,
  });

/** 获取首页数据 */
export const getHomePageData = () =>
  request<HomePageResDto>({
    url: '/home-page',
    method: 'GET',
  });

/** 获取所有分类(树形结构) */
export const getCategoryTree = () =>
  request<GetCategoryTreeResDto[]>({
    url: '/category/tree/client',
    method: 'GET',
  });
