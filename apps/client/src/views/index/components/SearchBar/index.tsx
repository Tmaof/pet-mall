import { SearchSuggestItem } from '@/api/home/res.dto';
import { debounce } from '@/utils/index';
import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearchSuggestions } from './hooks/useSearchSuggestions';
import './index.scss';

const SearchBar: FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const { suggestions, fetchSuggestions } = useSearchSuggestions();

  // 防抖处理搜索
  const debouncedSearch = debounce(fetchSuggestions, 300);

  useEffect(() => {
    if (keyword) {
      debouncedSearch(keyword);
    }
  }, [keyword, debouncedSearch]);

  /** 处理搜索 */
  const handleSearch = (value: string) => {
    if (value) {
      navigate(`/search?keyword=${encodeURIComponent(value)}`);
    }
  };

  /** 处理建议项点击 */
  const handleSelect = (value: string, option: SearchSuggestItem) => {
    if (option.type === 'category') {
      navigate(`/search?categoryId=${option.id}`);
    } else {
      navigate(`/search?keyword=${encodeURIComponent(value)}`);
    }
  };

  return (
    <div className="search-bar">
      <AutoComplete
        value={keyword}
        options={suggestions}
        onChange={setKeyword}
        onSelect={handleSelect}
        onSearch={handleSearch}
      >
        <Input size="large" placeholder="搜索商品" prefix={<SearchOutlined />} allowClear />
      </AutoComplete>
    </div>
  );
};

export { SearchBar };
