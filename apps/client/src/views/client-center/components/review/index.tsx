import { Tabs } from 'antd';
import { TabList } from './constants';

const Review = () => {
  return (
    <div>
      <Tabs size="small" type="card" items={TabList} />
    </div>
  );
};

export { Review as Comment };
