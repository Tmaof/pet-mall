import { Button, Drawer, Input } from 'antd';

interface ReplyInputProps {
  /** 标题 */
  title?: string;
  /** 内容 */
  content?: string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 是否打开 */
  open: boolean;
  /** 容器dom */
  containerDom: HTMLElement;
  /** 内容变化回调 */
  onChange?: (content: string) => void;
  /** 发送回复 */
  onSendReply?: (content: string) => void;
}

/** 回复输入框 */
export const ReplyInput = (props: ReplyInputProps) => {
  const { onClose, open, containerDom, content, onChange, onSendReply, title } = props;

  return (
    <Drawer
      title={title}
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
      getContainer={containerDom}
      rootStyle={{ position: 'absolute' }}
    >
      <Input.TextArea
        autoSize={{ minRows: 3, maxRows: 6 }}
        value={content}
        onChange={(e: any) => onChange?.(e.target.value)}
      />
      <Button type="primary" onClick={() => onSendReply?.(content ?? '')}>
        回复
      </Button>
    </Drawer>
  );
};
