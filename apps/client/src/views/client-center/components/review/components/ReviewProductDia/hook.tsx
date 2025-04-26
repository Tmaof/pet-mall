import { useShowDialogFn } from '@/utils/show-dialog';
import { ReviewProductDia, ReviewProductDiaProps } from '.';

export const useReviewProductDia = () => {
  const showDialog = useShowDialogFn();

  return {
    showReviewProductDia: (props: ReviewProductDiaProps) => {
      showDialog<typeof props>(ReviewProductDia, { ...props, open: true });
    },
  };
};
