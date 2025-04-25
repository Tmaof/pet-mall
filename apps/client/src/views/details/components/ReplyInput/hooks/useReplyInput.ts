import { ProductReviewListDto, ReviewReplyListDto } from '@/api/behaviour/review/res-dto';
import { useRef, useState } from 'react';
import { ReplyObj } from '../../ProductReview';

/**
 * 回复输入框 的 钩子
 * @param onSendReply 发送回复的回调
 * @returns
 */
export const useReplyInput = (onSendReply?: (replyObj: ReplyObj) => void) => {
  const replyInputWrapRef = useRef<HTMLDivElement>(null);

  const [openRely, setOpenRely] = useState(false);
  const [replyItem, setReplyItem] = useState<{
    clientname: string;
    parentId?: string | number;
    rootReviewId: string | number;
  } | null>(null);
  const [content, setContent] = useState('');

  /** 点击 回复 - 打开 回复输入框 */
  function handleClickRely(
    item: ProductReviewListDto['list'][number] | ReviewReplyListDto['list'][number]
  ) {
    setOpenRely(true);

    let rootReviewId = undefined;
    let parentId = undefined;
    if ('productReviewId' in item) {
      // 商品评论
      rootReviewId = item.productReviewId;
    } else {
      // 回复评论
      rootReviewId = item.rootReviewId;
      parentId = item.replyId;
    }
    // 设置 回复的 父评论id 和 根评论id
    setReplyItem({
      clientname: item.clientname,
      parentId,
      rootReviewId,
    });
  }

  /** 发送回复 */
  function handleSendReply(content: string) {
    content = content.trim();
    if (!content) return;
    if (!replyItem) return;
    onSendReply?.({
      content,
      parentId: replyItem.parentId,
      rootReviewId: replyItem.rootReviewId,
    });
    setOpenRely(false);
    setContent('');
  }

  return {
    /** 是否打开 */
    openRely,
    /** 设置 是否打开 */
    setOpenRely,
    /** 回复的 父评论id 和 根评论id */
    replyItem,
    /** 回复内容 */
    content,
    /** 设置 回复内容 */
    setContent,
    /** 点击 回复 - 打开 回复输入框 */
    handleClickRely,
    /** 发送回复 */
    handleSendReply,
    /** 回复输入框 容器dom */
    replyInputWrapRef,
  };
};
