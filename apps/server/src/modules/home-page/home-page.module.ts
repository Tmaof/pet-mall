import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '../behaviour/cart/cart.entity';
import { Product } from '../product/product/product.entity';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';
import { OrderItem } from '../order/entity/order-item.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, Cart, OrderItem])],
    controllers: [HomePageController],
    providers: [HomePageService],
})
export class HomePageModule {}
