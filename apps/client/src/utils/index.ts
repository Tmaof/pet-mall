import { ProductDto, SALE_STATUS, ProductBriefDto } from '@/api/index.type';

/** 防抖 */
export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/**
 * 判断商品是否被禁用：
 * - 如果商品已经下架
 * - 如果商品库存为0
 */
export const isDisabledOfProduct = (product: ProductDto | ProductBriefDto) => {
  const { stock, isOnSale } = product;
  const isDisabled = isOnSale === SALE_STATUS.stop || stock === 0;
  return isDisabled;
};
