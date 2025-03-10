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
  const vditorRef = useRef<Vditor>();
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!description || !domRef.current) return;

    const initVditor = async () => {
      if (!vditorRef.current) {
        vditorRef.current = new Vditor('vditor-preview', {
          mode: 'wysiwyg',
          preview: {
            mode: 'both',
          },
          toolbar: [],
          after: () => {
            vditorRef.current?.setValue(description);
            vditorRef.current?.disabled();
          },
        });
      } else {
        vditorRef.current.setValue(description);
      }
    };

    initVditor();

    return () => {
      vditorRef.current?.destroy();
      vditorRef.current = undefined;
    };
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
      <div id="vditor-preview" ref={domRef} />
    </div>
  );
};

export { ProductDescription };
