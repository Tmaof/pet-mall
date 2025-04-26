import { TabsProps } from 'antd';
import { ReviewedList } from './components/Reviewed';
import { ToReviewList } from './components/ToReview';

export const TabList: TabsProps['items'] = [
  {
    label: '待评价',
    key: 'to-review',
    children: <ToReviewList />,
  },
  {
    label: '已评价',
    key: 'reviewed',
    children: <ReviewedList />,
  },
];
