import { FloatButton } from 'antd';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductList } from './components/ProductList';
import { SearchBar } from './components/SearchBar';
import { useSearchProducts } from './hooks/useSearchProducts';
import './index.scss';

const Search: FC = () => {
  const { products, loading, pagination } = useSearchProducts();
  const navigate = useNavigate();

  const handleSearch = (keyword: string) => {
    navigate(`/search?keyword=${keyword}`);
  };

  return (
    <div className="search-page">
      <div className="search-content">
        <SearchBar onSearch={handleSearch} />
        <ProductList data={products} loading={loading} pagination={pagination} />
      </div>
      <FloatButton.Group shape="circle" style={{ insetInlineEnd: 8 }}>
        <FloatButton.BackTop visibilityHeight={200} />
      </FloatButton.Group>
    </div>
  );
};

export { Search };
