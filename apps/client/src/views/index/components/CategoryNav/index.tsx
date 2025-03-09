import { getCategoryTree } from '@/api/home';
import { GetCategoryTreeResDto } from '@/api/home/res.dto';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.scss';

const CategoryNav: FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<GetCategoryTreeResDto[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    getCategoryTree().then(setCategories);
  }, []);

  /** 处理分类点击 */
  const handleClick = (category: GetCategoryTreeResDto) => {
    if (!category.children?.length) {
      navigate(`/search?categoryId=${category.id}`);
    }
  };

  return (
    <nav className="category-nav">
      <ul className="category-list">
        {categories.map(category => (
          <li
            key={category.id}
            className="category-item"
            onMouseEnter={() => setActiveId(category.id)}
            onMouseLeave={() => setActiveId(null)}
            onClick={() => handleClick(category)}
          >
            <span className="category-name">{category.name}</span>
            {category.children?.length > 0 && activeId === category.id && (
              <div className="sub-categories">
                <ul className="sub-list">
                  {category.children.map(child => (
                    <li
                      key={child.id}
                      className="sub-item"
                      onClick={e => {
                        e.stopPropagation();
                        handleClick(child);
                      }}
                    >
                      {child.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { CategoryNav };
