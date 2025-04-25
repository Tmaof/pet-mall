import { useShowDialogFn } from '@/utils/show-dialog';
import { ReviewReplyDia, ReviewReplyDiaProps } from '.';

export const useReviewReplyDia = () => {
  const showDialog = useShowDialogFn();

  function showReviewReplyDia(props: ReviewReplyDiaProps) {
    showDialog(ReviewReplyDia, props);
  }

  return {
    /** 显示 评论的回复列表 的弹框 */
    showReviewReplyDia,
  };
};
