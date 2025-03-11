import { useShowDialogFn } from '@/utils/show-dialog';
import { BuyDialog, BuyDialogProps } from '.';

export const useBuyDialog = () => {
  const showDialog = useShowDialogFn();

  return {
    showBuyDialog: (props: BuyDialogProps) => {
      showDialog<BuyDialogProps>(BuyDialog, { ...props, open: true });
    },
  };
};
