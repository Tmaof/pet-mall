import { ReviewReplyListDto } from '@/api/behaviour/review/res-dto';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';
import { ReplyObj } from '../ProductReview';
import { ReplyInput } from '../ReplyInput';
import { useReplyInput } from '../ReplyInput/hooks/useReplyInput';

export interface ParentReview {
  /** 根评论ID */
  rootReviewId: number;
  /** 父评论ID */
  parentId?: number;
  /** 父评论内容 */
  content: string;
  /** 客户名称 */
  clientName: string;
  /** 客户头像 */
  clientAvatar: string;
  /** 评论时间 */
  createdAt: string;
}

export interface ReviewReplyDiaProps {
  /** 父评论 */
  parentReview?: ParentReview;
  /** 回复列表 */
  replyList?: ReviewReplyListDto['list'];
  /** 是否打开 */
  open: boolean;
  /** 返回上级 按钮点击事件 */
  onBack?: () => void;
  /** 关闭全部 按钮点击事件 */
  onCloseAll?: () => void;
  /** 展示回复列表 */
  onShowReply?: (item: ReviewReplyListDto['list'][number]) => void;
  /** 发送回复 */
  onSendReply?: (replyObj: ReplyObj) => void;
}

/** 展示 评论的回复列表 的弹框 */
export const ReviewReplyDia = (props: ReviewReplyDiaProps) => {
  const { open, parentReview, replyList, onShowReply } = props;
  const {
    openRely,
    replyItem,
    content,
    handleClickRely,
    handleSendReply,
    setOpenRely,
    setContent,
    replyInputWrapRef,
  } = useReplyInput(props.onSendReply);

  if (!parentReview || !replyList) return null;

  return (
    <Modal
      open={open}
      onOk={props?.onBack}
      onCancel={props?.onCloseAll}
      okText="返回上级"
      cancelText="关闭全部"
      title="回复列表"
      destroyOnClose={true}
    >
      <div className="review-reply-list" ref={replyInputWrapRef}>
        {/* 引用 父评论 */}
        <div className="parent-review">
          <div className="parent-review-avatar">
            <Avatar src={parentReview.clientAvatar} />
            <div className="parent-review-info">
              <div className="parent-review-info-name">{parentReview.clientName}</div>
              <div className="parent-review-info-time">{parentReview.createdAt}</div>
            </div>
          </div>
          <div className="parent-review-content">{parentReview.content}</div>
        </div>
        {/* 子评论列表 */}
        <div className="reply-list">
          {replyList.map(item => (
            <div className="reply-item-card" key={item.replyId}>
              <div className="reply-item-avatar">
                <Avatar src={item.clientAvatar} />
              </div>
              <div className="reply-item-content">{item.content}</div>
              <div className="footer">
                {/* 点赞 */}
                <div className="footer-like">
                  <div className="like-count">{item.likeCount}</div>
                  <LikeOutlined />
                </div>
                {/* 回复 */}
                <div className="footer-reply" onClick={() => onShowReply?.(item)}>
                  <div className="reply-count">{item.replyCount}</div>
                  <MessageOutlined />
                </div>
                {/* 回复 */}
                <div className="footer-reply-btn" onClick={() => handleClickRely(item)}>
                  回复ta
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* 回复输入框 */}
        {replyInputWrapRef.current && (
          <ReplyInput
            title={`回复 ${replyItem?.clientname}`}
            open={openRely}
            onClose={() => setOpenRely(false)}
            containerDom={replyInputWrapRef.current}
            content={content}
            onChange={setContent}
            onSendReply={handleSendReply}
          />
        )}
      </div>
    </Modal>
  );
};
