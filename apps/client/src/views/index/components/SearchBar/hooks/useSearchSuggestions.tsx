import { getSearchSuggestions } from '@/api/home';
import { SearchSuggestItem } from '@/api/home/res.dto';
import { useState } from 'react';

export const useSearchSuggestions = () => {
  const [suggestions, setSuggestions] = useState<SearchSuggestItem[]>([]);
  const [loading, setLoading] = useState(false);

  /** 获取搜索建议 */
  const fetchSuggestions = async (keyword: string) => {
    try {
      setLoading(true);
      const data = await getSearchSuggestions({ keyword });
      const options = data.suggestions.map(item => ({
        ...item,
        value: item.text,
      }));
      const indexItem = {
        text: keyword,
        type: 'all',
        id: 0,
      };
      // @ts-expect-error 忽略类型错误
      setSuggestions([indexItem, ...options]);
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestions,
    loading,
    fetchSuggestions,
  };
};
