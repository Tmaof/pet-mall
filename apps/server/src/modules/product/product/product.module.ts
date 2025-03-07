import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { CategoryModule } from '../category/category.module';
import { Tag } from '../tag/tag.entity';
import { TagService } from '../tag/tag.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Tag]), CategoryModule],
    controllers: [ProductController],
    providers: [ProductService, TagService],
    exports: [ProductService],
})
export class ProductModule {}
