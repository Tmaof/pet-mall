import { useShowDialogFn } from '@/utils/show-dialog';
import { AiImgSearch, AiImgSearchProps } from '.';

export const useAiImgSearch = () => {
  const showDialog = useShowDialogFn();

  return {
    showAiImgSearch: (props: AiImgSearchProps) => {
      showDialog<AiImgSearchProps>(AiImgSearch, { ...props, open: true });
    },
  };
};
