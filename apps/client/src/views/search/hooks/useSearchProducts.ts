import { ProductDto } from '@/api/index.type';
import { searchProducts } from '@/api/search';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useSearchProducts = () => {
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 12,
    total: 0,
  });

  const [searchParams] = useSearchParams();

  /** 加载商品数据 */
  const loadProducts = useCallback(async (params: Record<string, any>) => {
    try {
      setLoading(true);
      const data = await searchProducts(params);
      setProducts(data.list);
      setPagination(prev => ({
        ...prev,
        total: data.total,
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  /** 处理分页变化 */
  const handlePaginationChange = (current: number, pageSize: number) => {
    setPagination(prev => ({
      ...prev,
      current,
      pageSize,
    }));
  };

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    loadProducts({
      ...params,
      page: pagination.current,
      pageSize: pagination.pageSize.toString(),
    });
  }, [searchParams, loadProducts, pagination.current, pagination.pageSize]);

  return {
    products,
    loading,
    loadProducts,
    pagination: {
      ...pagination,
      onChange: handlePaginationChange,
    },
  };
};
