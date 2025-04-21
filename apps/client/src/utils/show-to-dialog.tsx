import { useShowDialogFn } from '@/utils/show-dialog';
import type { ModalProps } from 'antd';
import { Modal } from 'antd';

/** 返回一个函数：可以将jsx,组件等 渲染到一个对话框中 */
export const useShowToDialog = () => {
  const showDialog = useShowDialogFn();

  /** 将jsx or 组件等 渲染到一个对话框中 */
  const showToDialog = (jsx: React.ReactNode, modalProps?: ModalProps) => {
    const { handleDestroy } = showDialog<ModalProps>(Modal, {
      closable: true,
      footer: null,
      ...modalProps,
      children: jsx,
    })!;

    return {
      /** 销毁组件:从渲染的组件列表中移除 */
      handleDestroy,
    };
  };

  return {
    /** 将jsx or 组件等 渲染到一个对话框中 */
    showToDialog,
  };
};
