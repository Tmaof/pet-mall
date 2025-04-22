import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../behaviour/cart/cart.entity';
import { Product } from '../product/product/product.entity';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Cart])],
    controllers: [HomePageController],
    providers: [HomePageService],
})
export class HomePageModule {}
