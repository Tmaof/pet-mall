import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Param,
    Delete,
    UseGuards,
    Query
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './req-dto/create-product.dto';
import { UpdateProductDto } from './req-dto/update-product.dto';
import { QueryProductDto } from './req-dto/query-product.dto';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import { Public } from '@/decorator/index.decorator';

@Controller('product')
@UseGuards(JwtGuard)
export class ProductController {
    constructor (private readonly productService: ProductService) {}

    /**
     * 创建商品
     */
    @Post()
    async create (@Body() createProductDto: CreateProductDto) {
        const data = await this.productService.create(createProductDto);
        return getCommonRes({ data });
    }

    /**
     * 获取商品列表
     */
    @Get()
    async findAll (@Query() query: QueryProductDto) {
        const data = await this.productService.findAll(query);
        return getCommonRes({ data });
    }

    /**
     * 获取指定商品
     */
    @Get(':id')
    @Public()
    async findOne (@Param('id') id: string) {
        const data = await this.productService.findOne(+id);
        return getCommonRes({ data });
    }

    /**
     * 更新商品
     */
    @Put(':id')
    async update (
    @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        const data = await this.productService.update(+id, updateProductDto);
        return getCommonRes({ data });
    }

    /**
     * 删除商品
     */
    @Delete(':id')
    async remove (@Param('id') id: string) {
        await this.productService.remove(+id);
        return getCommonRes();
    }
}
