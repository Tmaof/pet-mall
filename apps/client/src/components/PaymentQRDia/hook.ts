import { useShowDialogFn } from '@/utils/show-dialog';
import { PaymentQRDia, PaymentQRDiaProps } from '.';

export const usePaymentQRDia = () => {
  const showDialog = useShowDialogFn();

  return {
    showPaymentQRDia: (props: PaymentQRDiaProps) => {
      showDialog<PaymentQRDiaProps>(PaymentQRDia, { ...props, open: true });
    },
  };
};
