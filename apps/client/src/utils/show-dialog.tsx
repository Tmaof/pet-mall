import { createContext, useContext, useState } from 'react';
import { createPortal } from 'react-dom';

const showDialogContext = createContext<ReturnType<typeof useShowDialog>['showDialog']>(() => {});

/**
 * 在子组件中可以使用 useShowDialogFn 来获取 showDialog 函数，来显示对话框组件。
 */
export const ShowDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { componentList, showDialog } = useShowDialog();
  return (
    <showDialogContext.Provider value={showDialog}>
      {/* 对话框组件渲染区 */}
      {componentList}
      {/* 组件渲染区 */}
      {children}
    </showDialogContext.Provider>
  );
};

/**
 * 获取 showDialog 函数，用于在组件中调用 来显示对话框组件。
 * 由于是将 对话框组件列表 componentList 渲染到 APP组件中，所以对话框组件可以 使用其他 Provider 提供的数据。
 * 例如：将可以将 <ShowDialogProvider> 渲染到 <ConfigProvider locale={locale}> 中，则对话框组件中的组件可以拿到 antd的 locale 数据。
 * 对比使用 createRoot来渲染组件，是新建了一个新的根节点，则不能使用另一个根节点中的 Provider 提供的数据。
 */
export const useShowDialogFn = () => {
  return useContext(showDialogContext);
};

/**
 * 调用 showDialog 时，传入的组件需要 props 必须包含 open、onOk、onCancel 属性
 */
type ShowDialogComponentNeedProps<onOkType, onCancelType> = {
  /** 是否打开 */
  open?: boolean;
  /** 确定按钮点击事件 */
  onOk?: (e?: onOkType) => void;
  /** 取消按钮点击事件 */
  onCancel?: (e?: onCancelType) => void;
};

const useShowDialog = () => {
  const [componentList, setComponentList] = useState<React.ReactNode[]>([]);

  /** 显示对话框
   * @param Component 组件
   * @param props 组件的props
   */
  const showDialog = <
    /** 组件的props */
    Props extends ShowDialogComponentNeedProps<onOkType, onCancelType>,
    /** 确定按钮点击事件的参数类型 */
    onOkType = any,
    /** 取消按钮点击事件的参数类型 */
    onCancelType = any,
  >(
    Component: React.FC<Props>,
    props: Props
  ) => {
    const { open = true, onOk, onCancel } = props;
    if (!open) return;

    const div = document.createElement('div');
    document.body.appendChild(div);

    const portal = createPortal(
      <Component
        {...props}
        open={true}
        onOk={e => {
          onOk?.(e);
          handleDestroy();
        }}
        onCancel={e => {
          onCancel?.(e);
          handleDestroy();
        }}
      />,
      div
    );
    setComponentList(prev => [...prev, portal]);
    /** 销毁组件:从渲染的组件列表中移除 */
    const handleDestroy = () => {
      const destroy = () => {
        const list = componentList.filter(item => item !== portal);
        setComponentList(list);
        // 删除div
        document.body.removeChild(div);
      };

      destroy();
    };
  };

  return {
    componentList,
    showDialog,
  };
};
