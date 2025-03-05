import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './req-dto/create-product.dto';
import { UpdateProductDto } from './req-dto/update-product.dto';
import { QueryProductDto, ProductOrderBy, OrderDirection } from './req-dto/query-product.dto';
import { ProductDto, ProductListDto } from './res-dto/product.dto';

@Injectable()
export class ProductService {
    constructor (@InjectRepository(Product)
    private productRepository: Repository<Product>,) {}

    /**
     * 创建商品
     * @param createProductDto 创建商品DTO
     */
    async create (createProductDto: CreateProductDto) {
        const product = this.productRepository.create(createProductDto);
        await this.productRepository.save(product);
    }

    /**
     * 查询商品列表
     * @param queryProductDto 查询条件
     */
    async findAll (queryProductDto: QueryProductDto): Promise<ProductListDto> {
        const {
            id,
            title,
            categoryId,
            isOnSale,
            createdAtStart,
            createdAtEnd,
            updatedAtStart,
            updatedAtEnd,
            orderBy = ProductOrderBy.CREATED_AT,
            orderDirection = OrderDirection.DESC,
            page = 1,
            pageSize = 10,
        } = queryProductDto;

        // 构建查询条件
        const where: any = {};
        if (id) where.id = id;
        if (title) where.title = Like(`%${title}%`);
        if (categoryId) where.categoryId = categoryId;
        if (isOnSale !== undefined) where.isOnSale = isOnSale;
        if (createdAtStart && createdAtEnd) {
            where.createdAt = Between(new Date(createdAtStart), new Date(createdAtEnd));
        }
        if (updatedAtStart && updatedAtEnd) {
            where.updatedAt = Between(new Date(updatedAtStart), new Date(updatedAtEnd));
        }

        // 执行查询
        const [products, total] = await this.productRepository.findAndCount({
            where,
            relations: ['category'],
            order: { [orderBy]: orderDirection },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list: products.map(product => this.toProductDto(product)),
            total,
        };
    }

    /**
     * 根据ID查找商品
     * @param id 商品ID
     */
    async findOne (id: number): Promise<ProductDto> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!product) {
            throw new Error('商品不存在');
        }

        return this.toProductDto(product);
    }

    /**
     * 更新商品
     * @param id 商品ID
     * @param updateProductDto 更新商品DTO
     */
    async update (id: number, updateProductDto: UpdateProductDto) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['category'],
        });

        if (!product) {
            throw new Error('商品不存在');
        }

        Object.assign(product, updateProductDto);
        await this.productRepository.save(product);
    }

    /**
     * 删除商品
     * @param id 商品ID
     */
    async remove (id: number): Promise<void> {
        const product = await this.productRepository.findOne({ where: { id } });

        if (!product) {
            throw new Error('商品不存在');
        }

        await this.productRepository.remove(product);
    }

    /**
     * 将商品实体转换为DTO
     * @param product 商品实体
     */
    private toProductDto (product: Product): ProductDto {
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
        };
    }
}
