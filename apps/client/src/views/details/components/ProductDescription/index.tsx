import { Skeleton } from 'antd';
import { FC, useEffect, useRef } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import './index.scss';

interface Props {
  description?: string;
  loading?: boolean;
}

const ProductDescription: FC<Props> = ({ description, loading }) => {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!description || !domRef.current) return;
    Vditor.preview(domRef.current, description, {
      mode: 'light',
    });
  }, [description]);

  if (loading) {
    return (
      <div className="product-description">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  return (
    <div className="product-description">
      <div ref={domRef} />
    </div>
  );
};

export { ProductDescription };
