import { SearchOutlined } from '@ant-design/icons';
import { Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './index.scss';

interface SearchBarProps {
  onSearch?: (keyword: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  /** 处理按下回车 */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(keyword);
    }
  };

  return (
    <div className="search-bar">
      <Input
        size="large"
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="搜索商品"
        prefix={<SearchOutlined />}
        allowClear
      />
    </div>
  );
};

export { SearchBar };
