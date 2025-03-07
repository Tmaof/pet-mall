import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Query,
    UseGuards,
    Put
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './req-dto/create-tag.dto';
import { UpdateTagDto } from './req-dto/update-tag.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';

@Controller('tag')
@UseGuards(JwtGuard)
export class TagController {
    constructor (private readonly tagService: TagService) {}

    /**
     * 创建标签
     */
    @Post()
    async create (@Body() createTagDto: CreateTagDto) {
        const data = await this.tagService.create(createTagDto);
        return getCommonRes({ data });
    }

    /**
     * 获取标签列表
     */
    @Get()
    async findAll (
        @Query('page')
        page = 1,
        @Query('pageSize')
        pageSize = 10
    ) {
        const data = await this.tagService.findAll(page, pageSize);
        return getCommonRes({ data });
    }

    /**
     * 获取所有标签
     */
    @Get('all')
    async findAllTags () {
        const data = await this.tagService.findAllTags();
        return getCommonRes({ data });
    }

    /**
     * 获取指定标签
     */
    @Get(':id')
    async findOne (@Param('id') id: string) {
        const data = await this.tagService.findOne(+id);
        return getCommonRes({ data });
    }

    /**
     * 更新标签
     */
    @Put(':id')
    async update (
    @Param('id') id: string,
        @Body() updateTagDto: UpdateTagDto
    ) {
        const data = await this.tagService.update(+id, updateTagDto);
        return getCommonRes({ data });
    }

    /**
     * 删除标签
     */
    @Delete(':id')
    async remove (@Param('id') id: string) {
        await this.tagService.remove(+id);
        return getCommonRes();
    }
}
