import { getCategoryTree } from '@/api/home';
import { GetCategoryTreeResDto } from '@/api/home/res.dto';
import { useEffect, useState } from 'react';

export const useCategoryNav = () => {
  const [categories, setCategories] = useState<GetCategoryTreeResDto[]>([]);

  useEffect(() => {
    getCategoryTree().then(res => {
      setCategories(res);
    });
  }, []);

  return { categories };
};
