import { getProductDetails } from '@/api/details';
import { ProductDto } from '@/api/index.type';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const useProductDetails = () => {
  const [product, setProduct] = useState<ProductDto | null>(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  /** 加载商品详情 */
  const loadProductDetails = async (id: number) => {
    try {
      setLoading(true);
      const data = await getProductDetails({ id });
      setProduct(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadProductDetails(Number(id));
    }
  }, [id]);

  return {
    product,
    loading,
  };
};
