import { ReviewReplyListDto } from '@/api/behaviour/review/res-dto';
import { DownOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Modal } from 'antd';
import dayjs from 'dayjs';
import { ReplyObj } from '../ProductReview';
import { ReplyInput } from '../ReplyInput';
import { useReplyInput } from '../ReplyInput/hooks/useReplyInput';
import './index.scss';
import classNames from 'classnames';

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
  /** 是否展示加载更多 */
  showLoadMore?: boolean;
  /** 加载更多 */
  onLoadMore?: () => void;
  /** 点赞 */
  onLike?: (item: ReviewReplyListDto['list'][number]) => void;
}

/** 评论的回复列表 */
export const ReviewReplyDia = (props: ReviewReplyDiaProps) => {
  const {
    open,
    parentReview,
    replyList,
    onShowReply,
    onBack,
    onCloseAll,
    showLoadMore,
    onLoadMore,
    onLike,
  } = props;
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

  if (!open) return null;

  return (
    <Modal
      open={open}
      onOk={onBack}
      onCancel={onCloseAll}
      okText="返回上级"
      cancelText="关闭全部"
      title="回复列表"
      destroyOnClose={true}
      width={600}
      wrapClassName="review-reply-dialog"
    >
      <div ref={replyInputWrapRef}>
        {/* 父评论 */}
        <div className="parent-review">
          <div className="parent-review-header">
            <Avatar src={parentReview?.clientAvatar} />
            <div className="parent-review-header-info">
              <div className="parent-review-header-info-name">{parentReview?.clientName}</div>
              <div className="parent-review-header-info-time">{parentReview?.createdAt}</div>
            </div>
          </div>
          <div className="parent-review-content">{parentReview?.content}</div>
        </div>

        {/* 回复列表 */}
        <div className="reply-list">
          {replyList?.map(item => (
            <div key={item.replyId} className="reply-item">
              <div className="reply-item-header">
                <Avatar src={item.clientAvatar} />
                <div className="reply-item-header-info">
                  <div className="reply-item-header-info-name">
                    {item.clientname}
                    {item.replyToClientname && (
                      <>
                        <span className="reply-to">回复</span>
                        {item.replyToClientname}
                      </>
                    )}
                  </div>
                  <div className="reply-item-header-info-time">
                    {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
              </div>
              <div className="reply-item-content">{item.content}</div>
              <div className="reply-item-footer">
                <div
                  className={classNames({
                    'action-btn like-btn': true,
                    liked: item.liked,
                  })}
                  onClick={() => onLike?.(item)}
                >
                  <span className="like-count">{item.likeCount}</span>
                  <LikeOutlined />
                </div>
                <div className="action-btn" onClick={() => onShowReply?.(item)}>
                  <span>{item.replyCount}</span>
                  <MessageOutlined />
                </div>
                <div className="action-btn" onClick={() => handleClickRely(item)}>
                  回复ta
                </div>
              </div>
            </div>
          ))}
          {showLoadMore && (
            <div className="load-more" onClick={onLoadMore}>
              <DownOutlined />
            </div>
          )}
        </div>

        {/* 回复输入框 */}
        {replyInputWrapRef.current && (
          <ReplyInput
            title={`回复 ${replyItem?.clientname}`}
            open={openRely}
            onClose={() => {
              setOpenRely(false);
              setContent('');
            }}
            containerDom={replyInputWrapRef.current}
            content={content}
            onChange={setContent}
            onSendReply={handleSendReply}
            height=""
          />
        )}
      </div>
    </Modal>
  );
};
