import { ProductReviewListDto } from '@/api/behaviour/review/res-dto';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Avatar, Image, Rate } from 'antd';
import dayjs from 'dayjs';
import { ReplyInput } from '../ReplyInput';
import { useReplyInput } from '../ReplyInput/hooks/useReplyInput';

export type ReplyObj = {
  content: string;
  parentId?: string | number;
  rootReviewId: string | number;
};

interface ProductReviewProps {
  reviewList: ProductReviewListDto['list'];
  /** 展示回复列表 */
  onShowRelyList?: (item: ProductReviewListDto['list'][number]) => void;
  /** 发送回复 */
  onSendReply?: (replyObj: ReplyObj) => void;
}

/** 商品评论展示组件 */
export const ProductReview = (props: ProductReviewProps) => {
  const { reviewList, onShowRelyList } = props;
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

  return (
    <div className="product-review" ref={replyInputWrapRef}>
      {reviewList.map(item => (
        <div className="product-review-item-card" key={item.productReviewId}>
          <div className="card-header">
            <Avatar src={item.clientAvatar} />
            <div className="card-header-info">
              <div className="card-header-info-name">{item.clientname}</div>
              <div className="card-header-info-rating">
                <Rate disabled defaultValue={item.rating} />
              </div>
              <div className="card-header-info-time">
                {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </div>
          </div>
          {/* 内容 */}
          <div className="card-content">{item.content}</div>
          {/* 图片 */}
          <div className="img-contianer">
            {item?.images?.map(image => <Image key={image} src={image} alt="商品图片" />)}
          </div>
          {/* 底部 */}
          <div className="card-footer">
            <div className="card-footer-like">
              {/* 点赞 */}
              <div className="card-footer-like-icon">
                <div className="like-count">{item.likeCount}</div>
                <LikeOutlined />
              </div>
              {/* 回复 */}
              <div className="card-footer-reply" onClick={() => onShowRelyList?.(item)}>
                <div className="reply-count">{item.replyCount}</div>
                <MessageOutlined />
              </div>
              {/*  */}
              <div className="card-footer-reply-btn" onClick={() => handleClickRely(item)}>
                回复ta
              </div>
            </div>
          </div>
        </div>
      ))}
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
  );
};
