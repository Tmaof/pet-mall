import { getProductReviewList, getReviewReplyList, replyReview } from '@/api/behaviour/review';
import { ProductReviewListDto, ReviewReplyListDto } from '@/api/behaviour/review/res-dto';
import { Drawer, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductReview, ReplyObj } from '../ProductReview';
import { ParentReview, ReviewReplyDia } from '../ReviewReplyDia';
import './index.scss';

interface ReviewDrawerProps {
  productId: number | undefined;
  open: boolean;
  onClose: () => void;
}

interface ReplyListStack {
  parentReview: ParentReview;
  replyList: ReviewReplyListDto['list'];
  page: number;
  pageSize: number;
  total: number;
}

/** 商品评价抽屉 */
export const ReviewDrawer = (props: ReviewDrawerProps) => {
  const { open, onClose, productId } = props;
  const [reviewList, setReviewList] = useState<ProductReviewListDto['list']>([] as any);
  const [openRely, setOpenRely] = useState(false);
  //   回复列表的栈
  const [replyListStack, setReplyListStack] = useState<ReplyListStack[]>([]);
  //   商品评价列表的 分页
  const page = useRef(1);
  const pageSize = useRef(10);
  const total = useRef(Infinity);

  //   当前展示的回复列表
  const currentReplyProp = useMemo(() => {
    return replyListStack[replyListStack.length - 1];
  }, [replyListStack]);

  /** 刷新 or 加载更多 【商品评价】列表 */
  const fetchReviewList = (productId?: number, type: 'refresh' | 'loadMore' = 'refresh') => {
    if (!productId) return;
    let currentPage = page.current;
    if (type === 'refresh') {
      currentPage = 1;
    } else {
      currentPage += 1;
    }
    getProductReviewList({
      productId,
      page: currentPage,
      pageSize: pageSize.current,
    }).then(res => {
      page.current = res.page;
      pageSize.current = res.pageSize;
      total.current = res.total;
      if (type === 'refresh') {
        setReviewList(res.list);
      } else {
        setReviewList([...reviewList, ...res.list]);
      }
    });
  };

  // 获取【商品评价】列表
  useEffect(() => {
    fetchReviewList(productId);
  }, [productId]);

  /** 展示 【商品评论】和【回复评论】的 回复列表 */
  async function handleShowReviewReplyDia(
    item: ProductReviewListDto['list'][number] | ReviewReplyListDto['list'][number]
  ) {
    // 如果 没有回复 则不展示
    if (item.replyCount === 0) {
      return;
    }
    let rootReviewId = undefined;
    let parentId = undefined;
    if ('productReviewId' in item) {
      rootReviewId = item.productReviewId;
    } else {
      rootReviewId = item.rootReviewId;
      parentId = item.replyId;
    }

    // 请求数据
    const res = await getReviewReplyList({
      rootReviewId,
      parentId,
      page: 1,
      pageSize: 10,
    });

    const stack = [...replyListStack];
    stack.push({
      parentReview: {
        content: item.content,
        clientName: item.clientname,
        clientAvatar: item.clientAvatar,
        createdAt: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
        rootReviewId,
        parentId,
      },
      replyList: res.list,
      page: res.page,
      pageSize: res.pageSize,
      total: res.total,
    });
    setReplyListStack(stack);

    // 显示回复列表
    setOpenRely(true);
  }

  /**
   * 刷新当前的回复列表；
   * 上拉加载更多；
   */
  async function fetchReplyList(type: 'refresh' | 'loadMore') {
    if (!currentReplyProp) return;
    let currentPage = currentReplyProp.page;
    if (type === 'refresh') {
      currentPage = 1;
    } else {
      currentPage += 1;
    }
    const res = await getReviewReplyList({
      rootReviewId: currentReplyProp.parentReview.rootReviewId,
      parentId: currentReplyProp.parentReview.parentId,
      page: currentPage,
      pageSize: currentReplyProp.pageSize,
    });
    // 更新当前的回复列表
    const stack = [...replyListStack];
    const curReplyProp = stack[stack.length - 1];
    if (!curReplyProp) return;
    curReplyProp.page = res.page;
    curReplyProp.pageSize = res.pageSize;
    curReplyProp.total = res.total;
    if (type === 'refresh') {
      curReplyProp.replyList = res.list;
    } else {
      curReplyProp.replyList = [...curReplyProp.replyList, ...res.list];
    }
    // 更新栈
    setReplyListStack(stack);
  }

  /** 关闭 回复列表 */
  function handleCloseReviewReplyDia() {
    // 清空栈
    setReplyListStack([]);
    setOpenRely(false);
  }

  /** 返回上级 回复列表 */
  function handleBackReviewReplyDia() {
    const stack = replyListStack.slice(0, -1);
    setReplyListStack(stack);
    if (!stack.length) {
      setOpenRely(false);
    }
  }

  /** 回复 【商品评论】和【回复评论】 */
  async function handleReply(replyObj: ReplyObj) {
    await replyReview({
      content: replyObj.content,
      parentId: replyObj.parentId ? Number(replyObj.parentId) : undefined,
      rootReviewId: Number(replyObj.rootReviewId),
    });
    message.success('回复成功');
    if (!replyObj.parentId) {
      // 刷新 【商品评价】列表，更新数量
      fetchReviewList(productId);
    } else {
      // 刷新 【回复评论】列表，更新数量
      fetchReplyList('refresh');
    }
  }

  return (
    <Drawer
      rootClassName="product-review-drawer"
      title="商品评价"
      placement="left"
      closable={false}
      onClose={onClose}
      open={open}
    >
      {/* 商品评论列表 */}
      <ProductReview
        reviewList={reviewList}
        onShowRelyList={handleShowReviewReplyDia}
        onSendReply={handleReply}
        showLoadMore={total.current > reviewList.length}
        onLoadMore={() => fetchReviewList(productId, 'loadMore')}
      />
      {/* 评论的回复列表 */}
      <ReviewReplyDia
        open={openRely}
        parentReview={currentReplyProp?.parentReview}
        replyList={currentReplyProp?.replyList}
        onShowReply={handleShowReviewReplyDia}
        onBack={() => handleBackReviewReplyDia()}
        onCloseAll={() => handleCloseReviewReplyDia()}
        onSendReply={handleReply}
        showLoadMore={currentReplyProp?.total > currentReplyProp?.replyList.length}
        onLoadMore={() => fetchReplyList('loadMore')}
      />
    </Drawer>
  );
};
