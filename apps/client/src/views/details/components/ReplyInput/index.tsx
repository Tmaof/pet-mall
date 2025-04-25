import { Button, Input } from 'antd';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import './index.scss';

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
  /** 高度 */
  height?: string;
  /** 最小行数 */
  minRows?: number;
  /** 最大行数 */
  maxRows?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数统计 */
  showCount?: boolean;
}

/** 回复输入框 */
export const ReplyInput = (props: ReplyInputProps) => {
  const {
    onClose,
    open,
    containerDom,
    content,
    onChange,
    onSendReply,
    title,
    height,
    minRows,
    maxRows,
    maxLength,
    showCount,
  } = props;

  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    containerDom.style.position = 'relative';
    containerDom.style.height = '100%';
    containerDom.style.width = '100%';
    containerDom.style.overflowY = 'auto';
    containerDom.style.overflowX = 'hidden';
  }, []);

  useEffect(() => {
    // 等待动画结束后再关闭（销毁）
    if (!open) {
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    } else {
      setIsOpen(true);
    }
  }, [open]);

  if (!isOpen) return null;

  return (
    <div
      className={classNames({
        'reply-input-drawer': true,
        'reply-input-drawer-open': open,
        'reply-input-drawer-close': !open,
      })}
    >
      <div className="reply-input-drawer-mask" onClick={onClose}></div>
      <div className="reply-input-drawer-content" style={{ height: height ?? '300px' }}>
        <div className="drawer-title">{title}</div>
        <Input.TextArea
          autoSize={{ minRows: minRows ?? 6, maxRows: maxRows ?? 7 }}
          value={content}
          onChange={(e: any) => onChange?.(e.target.value)}
          showCount={showCount ?? true}
          maxLength={maxLength ?? 500}
        />
        <Button type="primary" onClick={() => onSendReply?.(content ?? '')}>
          回复
        </Button>
      </div>
    </div>
  );
};
