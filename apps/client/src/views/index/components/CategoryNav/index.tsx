import { AlignLeftOutlined } from '@ant-design/icons';
import { Cascader } from 'antd';
import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCategoryNav } from './hooks';
import './index.scss';

const CategoryNav: FC = () => {
  const navigate = useNavigate();
  const { categories } = useCategoryNav();

  /** 处理分类点击 */
  const handleChange = (value: number[]) => {
    navigate(`/search?categoryId=${value[value.length - 1]}`);
  };

  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  // 控制所有分类展开
  const [openAllCategory, setOpenAllCategory] = useState<boolean>(false);
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const className = (e.target as HTMLElement).className;
      if (className.includes('ant-cascader')) {
        return;
      }
      setOpenAllCategory(false);
    };
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <nav className="category-nav">
      <div
        className={classNames('category-all-icon', {
          'category-all-icon-active': openAllCategory,
        })}
      >
        <AlignLeftOutlined
          onClick={e => {
            e.stopPropagation();
            setOpenAllCategory(true);
          }}
        />
        <Cascader
          placement="bottomRight"
          fieldNames={{ label: 'name', value: 'id', children: 'children' }}
          expandTrigger="hover"
          options={categories}
          open={openAllCategory}
          onChange={handleChange}
          size="large"
        />
      </div>
      <ul className="category-list">
        {categories.map(category => (
          <li
            key={category.id}
            className={classNames('category-item', {
              'active-category-item': category.id === openCategoryId,
            })}
            onMouseMove={() => setOpenCategoryId(category.id)}
            onMouseLeave={() => setOpenCategoryId(null)}
          >
            <div className="category-name">{category.name}</div>
            <Cascader
              fieldNames={{ label: 'name', value: 'id', children: 'children' }}
              expandTrigger="hover"
              options={category.children}
              open={category.id === openCategoryId}
              onChange={handleChange}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
};

export { CategoryNav };
