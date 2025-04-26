import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { Category } from './category.entity';
import { CreateCategoryDto } from './req-dto/create-category.dto';
import { GetCategoryTreeResDto } from './res-dto';

@Injectable()
export class CategoryService {
    constructor (
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>
    ) {}

    /** 创建分类 */
    async create (dto: CreateCategoryDto) {
        const category = new Category();
        category.name = dto.name;
        category.sortOrder = dto.sortOrder || 0;
        category.isVisible = dto.isVisible ?? true;

        if (dto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
            if (!parent) {
                return { success: false, message: '父分类不存在' };
            }
            category.parent = parent;
        }

        await this.categoryRepository.save(category);
    }

    /** 获取分类树
     * @param isVisible 是否只返回可见的分类
     */
    async getCategoryTree (isNeedVisible = false) {
        const categories = await this.categoryRepository.find({ relations: ['parent'], where: { isVisible: isNeedVisible ? true : undefined } });

        /** 格式化分类 */
        function formatCategory (category: Category): GetCategoryTreeResDto {
            return {
                id: category.id,
                name: category.name,
                sortOrder: category.sortOrder,
                isVisible: category.isVisible,
                parentId: category.parent?.id || null,
                children: [],
            };
        }

        const categoryMap = new Map();
        const rootCategories: GetCategoryTreeResDto[] = [];

        // 1. 保存根分类；2. 保存 父分类id 到 子分类列表的映射关系
        categories.forEach(category => {
            const formattedCategory = formatCategory(category);
            if (!category.parent) {
                rootCategories.push(formattedCategory);
            } else {
                const list = categoryMap.get(category.parent.id) || [];
                list.push(formattedCategory);
                categoryMap.set(category.parent.id, list);
            }
        });

        /** 构建树结构 */
        function buildTree (categoryList: GetCategoryTreeResDto[]) {
            for (const category of categoryList) {
                const children = categoryMap.get(category.id) || [];
                buildTree(children);
                category.children = children;
            }
        }
        buildTree(rootCategories);

        /** 排序 */
        const sortCategories = (items: GetCategoryTreeResDto[]) => {
            items.sort((aItem, bItem) => bItem.sortOrder - aItem.sortOrder);
            items.forEach(item => {
                if (item.children.length > 0) {
                    sortCategories(item.children);
                }
            });
        };

        sortCategories(rootCategories);
        return rootCategories;
    }

    /** 获取分类 */
    async findOne (id: number) {
        return this.categoryRepository.findOne({ where: { id } });
    }

    /** 删除分类 */
    async delete (id: number) {
        const queryRunner = this.categoryRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const category = await this.categoryRepository.findOne({ where: { id } });

            if (!category) {
                throw new Error('分类不存在');
            }

            /** 递归删除分类 */
            const deleteCategory = async (parentId: number) => {
                const children = await this.categoryRepository.find({ where: { parent: { id: parentId } } });

                for (const child of children) {
                    await deleteCategory(child.id);
                }

                // 删除分类前，需要把商品表中的分类id设置为null
                await this.productRepository.update({ categoryId: parentId }, { categoryId: null });

                // 删除分类
                await this.categoryRepository.delete(parentId);
            };

            await deleteCategory(id);
            await queryRunner.commitTransaction();

            return { success: true, message: '删除成功' };
        } catch (error) {
            await queryRunner.rollbackTransaction();
            return { success: false, message: `删除失败: ${error.message}` };
        } finally {
            await queryRunner.release();
        }
    }

    /** 更新分类 */
    async update (id: number, dto: Partial<CreateCategoryDto>) {
        const category = await this.categoryRepository.findOne({ where: { id } });

        if (!category) {
            return { success: false, message: '分类不存在' };
        }

        if (dto.parentId) {
            const parent = await this.categoryRepository.findOne({ where: { id: dto.parentId } });
            if (!parent) {
                return { success: false, message: '父分类不存在' };
            }
            category.parent = parent;
        }

        Object.assign(category, dto);
        await this.categoryRepository.save(category);
        return { success: true, message: '更新成功' };
    }
}
