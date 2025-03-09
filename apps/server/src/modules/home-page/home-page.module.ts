import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product/product.entity';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    controllers: [HomePageController],
    providers: [HomePageService],
})
export class HomePageModule {}
