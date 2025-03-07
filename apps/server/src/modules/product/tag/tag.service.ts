import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './req-dto/create-tag.dto';
import { UpdateTagDto } from './req-dto/update-tag.dto';
import { TagDto, TagListDto } from './res-dto/tag.dto';

@Injectable()
export class TagService {
    constructor (@InjectRepository(Tag)
    private tagRepository: Repository<Tag>,) {}

    /**
     * 创建标签
     * @param createTagDto 创建标签DTO
     * @returns 创建的标签信息
     */
    async create (createTagDto: CreateTagDto): Promise<TagDto> {
        // 检查标签名是否已存在
        const existingTag = await this.tagRepository.findOne({ where: { name: createTagDto.name } });

        if (existingTag) {
            throw new Error('标签名称已存在');
        }

        const tag = this.tagRepository.create(createTagDto);
        const savedTag = await this.tagRepository.save(tag);
        return this.toTagDto(savedTag);
    }

    /**
     * 获取标签列表
     * @param page 页码
     * @param pageSize 每页数量
     * @returns 标签列表及总数
     */
    async findAll (page = 1, pageSize = 10): Promise<TagListDto> {
        const [tags, total] = await this.tagRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { id: 'DESC' },
        });

        return {
            list: tags.map(tag => this.toTagDto(tag)),
            total,
        };
    }

    /**
     * 获取所有标签
     * @returns 标签列表
     */
    async findAllTags () {
        return await this.tagRepository.find();
    }

    /**
     * 根据ID列表查找标签
     * @param ids 标签ID列表
     * @returns 标签列表
     */
    async findByIds (ids: number[]) {
        const tags = await this.tagRepository.find({ where: { id: In(ids) } });
        return tags;
    }

    /**
     * 根据ID查找标签
     * @param id 标签ID
     * @returns 标签信息
     */
    async findOne (id: number): Promise<TagDto> {
        const tag = await this.tagRepository.findOne({ where: { id } });

        if (!tag) {
            throw new Error('标签不存在');
        }

        return this.toTagDto(tag);
    }

    /**
     * 更新标签
     * @param id 标签ID
     * @param updateTagDto 更新标签DTO
     * @returns 更新后的标签信息
     */
    async update (id: number, updateTagDto: UpdateTagDto): Promise<TagDto> {
        const tag = await this.tagRepository.findOne({ where: { id } });

        if (!tag) {
            throw new Error('标签不存在');
        }

        // 如果要更新名称，检查新名称是否已存在
        if (updateTagDto.name && updateTagDto.name === tag.name) {
            throw new Error('标签名称已存在');
        }

        Object.assign(tag, updateTagDto);
        const updatedTag = await this.tagRepository.save(tag);
        return this.toTagDto(updatedTag);
    }

    /**
     * 删除标签
     * @param id 标签ID
     */
    async remove (id: number): Promise<void> {
        const tag = await this.tagRepository.findOne({ where: { id } });

        if (!tag) {
            throw new Error('标签不存在');
        }

        await this.tagRepository.remove(tag);
    }

    /**
     * 将标签实体转换为DTO
     * @param tag 标签实体
     * @returns 标签DTO
     */
    private toTagDto (tag: Tag): TagDto {
        return {
            id: tag.id,
            name: tag.name,
        };
    }
}
