import { Product } from '../product.entity';
import { ProductBriefDto, ProductDto } from '../res-dto/product.dto';

/**
 * 将商品实体转换为DTO
 * @param product 商品实体
 */
export function toProductDto (product: Product): ProductDto {
    return {
        id: product.id,
        title: product.title,
        categoryId: product.categoryId,
        categoryName: product.category?.name || '',
        mainImage: product.mainImage,
        description: product.description || '',
        price: Number(product.price),
        stock: product.stock,
        isOnSale: product.isOnSale,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        tags: product.tags,
    };
}

/**
 *  将商品实体转换为 简单商品信息 DTO
 * @param product
 * @returns
 */
export function toProductBriefDto (product: Product): ProductBriefDto {
    return {
        id: product.id,
        title: product.title,
        categoryId: product.categoryId,
        categoryName: product.category?.name || '',
        mainImage: product.mainImage,
        price: Number(product.price),
        stock: product.stock,
        isOnSale: product.isOnSale,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
    };
}
