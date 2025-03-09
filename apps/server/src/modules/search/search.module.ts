import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../product/category/category.entity';
import { Product } from '../product/product/product.entity';
import { Tag } from '../product/tag/tag.entity';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Category, Tag])],
    controllers: [SearchController],
    providers: [SearchService],
    exports: [SearchService],
})
export class SearchModule {}
