import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { CategoryService } from '../category/category.service';
import { TagService } from '../tag/tag.service';
import { Product } from './product.entity';
import { CreateProductDto } from './req-dto/create-product.dto';
import { OrderDirection, ProductOrderBy, QueryProductDto } from './req-dto/query-product.dto';
import { UpdateProductDto } from './req-dto/update-product.dto';
import { ProductDto, ProductListDto } from './res-dto/product.dto';
import { toProductDto } from './utils';
import { SALE_STATUS } from './enum';

@Injectable()
export class ProductService {
    constructor (
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        private categoryService: CategoryService,
        private tagService: TagService
    ) {}

    /**
     * 创建商品
     * @param createProductDto 创建商品DTO
     */
    async create (createProductDto: CreateProductDto) {
        const { tagIds, ...productData } = createProductDto;
        const product = this.productRepository.create(productData);

        if (tagIds) {
            const tags = await this.tagService.findByIds(tagIds);
            product.tags = tags;
        }

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
            relations: ['category', 'tags'],
            order: { [orderBy]: orderDirection },
            skip: (page - 1) * pageSize,
            take: pageSize,
        });

        return {
            list: products.map(product => toProductDto(product)),
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
            relations: ['category', 'tags'],
        });

        if (!product) {
            throw new Error('商品不存在');
        }

        return toProductDto(product);
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

        // 商品-分类 关联
        if (updateProductDto.categoryId) {
            const category = await this.categoryService.findOne(updateProductDto.categoryId);
            if (!category) {
                throw new Error('分类不存在');
            } else {
                product.category = category;
            }
        }

        // 商品-标签 关联
        if (updateProductDto?.tagIds?.length) {
            const tags = await this.tagService.findByIds(updateProductDto.tagIds);
            product.tags = tags;
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

        /**
         * 目前逻辑删除：
         * 1. 商品下架
         * 2. 商品删除 isDelete = true
         */
        product.isDelete = true;
        product.isOnSale = SALE_STATUS.stop;

        await this.productRepository.save(product);
    }
}
