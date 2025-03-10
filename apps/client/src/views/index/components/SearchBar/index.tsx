import { SearchSuggestItem } from '@/api/home/res.dto';
import { debounce } from '@/utils/index';
import { SearchOutlined } from '@ant-design/icons';
import { AutoComplete, Tag } from 'antd';
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchResultTypeMap } from './constants.ts';
import { useSearchSuggestions } from './hooks/useSearchSuggestions.tsx';
import './index.scss';

const SearchBar: FC = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const { suggestions, fetchSuggestions } = useSearchSuggestions();

  // 防抖处理搜索
  const debouncedSearch = debounce(fetchSuggestions, 500);

  /** 处理建议项点击 */
  const handleSelect = (value: string, option: SearchSuggestItem) => {
    navigate(`/search?keyword=${encodeURIComponent(value)}&type=${option.type}&id=${option.id}`);
  };

  /** 处理数据源渲染 */
  const onDropdownRender = () => {
    return (
      <div className="home-page-dropdown-container">
        {suggestions.map(item => {
          const { name, color } = SearchResultTypeMap[item.type];
          return (
            <div
              className="dropdown-item"
              key={item.id + item.text}
              onClick={() => handleSelect(item.text, item)}
            >
              <div className="dropdown-item-text">{item.text}</div>
              <div className="dropdown-item-tag">
                <Tag color={color}>{name}</Tag>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /** 处理输入框按下回车 */
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigate(`/search?keyword=${encodeURIComponent(keyword)}&type=all`);
    }
  };

  return (
    <div className="search-bar">
      <AutoComplete
        value={keyword}
        options={suggestions}
        onChange={setKeyword}
        onSearch={debouncedSearch}
        placeholder="快来搜索商品吧~"
        prefix={<SearchOutlined />}
        allowClear
        size="large"
        dropdownRender={onDropdownRender}
        onInputKeyDown={handleInputKeyDown}
      ></AutoComplete>
    </div>
  );
};

export { SearchBar };
