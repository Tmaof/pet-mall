import { useAppDispatch, useAppSelector } from '@/store';
import { fetchHomeData } from '@/store/modules/index';
import { FC, useEffect } from 'react';
import { CategoryNav } from './components/CategoryNav';
import { Footer } from './components/Footer';
import { ProductModules } from './components/ProductModules';
import { SearchBar } from './components/SearchBar';
import './index.scss';

const Index: FC = () => {
  const dispatch = useAppDispatch();
  const { homeData, loading } = useAppSelector(state => state.index);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  return (
    <div className="index-page">
      <div className="index-content">
        <CategoryNav />
        <SearchBar />
        <ProductModules data={homeData?.modules} loading={loading} />
      </div>
      <Footer />
    </div>
  );
};

export { Index };
