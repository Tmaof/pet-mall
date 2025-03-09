import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './req-dto/create-category.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import { Public } from '@/decorator/index.decorator';

@Controller('category')
@UseGuards(JwtGuard)
export class CategoryController {
    constructor (private readonly categoryService: CategoryService) {}

    /** 创建分类 */
    @Post()
    async create (@Body() createCategoryDto: CreateCategoryDto) {
        const res = await this.categoryService.create(createCategoryDto);
        return getCommonRes(res);
    }

    /** 获取分类树 */
    @Get('tree')
    @Public()
    async getCategoryTree () {
        const data = await this.categoryService.getCategoryTree();
        return getCommonRes({ data });
    }

    /** 删除分类 */
    @Delete(':id')
    async delete (@Param('id') id: number) {
        const res = await this.categoryService.delete(id);
        return getCommonRes(res);
    }

    /** 更新分类 */
    @Put(':id')
    async update (
    @Param('id') id: number,
        @Body() updateCategoryDto: Partial<CreateCategoryDto>
    ) {
        const res = await this.categoryService.update(id, updateCategoryDto);
        return getCommonRes(res);
    }
}
