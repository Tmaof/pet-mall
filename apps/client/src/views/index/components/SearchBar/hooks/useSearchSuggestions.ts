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
      setSuggestions(
        data.suggestions.map(item => ({
          ...item,
          value: item.text,
        }))
      );
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
