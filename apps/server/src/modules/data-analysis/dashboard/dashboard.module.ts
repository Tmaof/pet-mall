import { Client } from '@/modules/client/client/client.entity';
import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Order } from '@/modules/order/entity/order.entity';
import { Product } from '@/modules/product/product/product.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product, Client]),
    ],
    controllers: [DashboardController],
    providers: [DashboardService],
    exports: [DashboardService],
})
export class DashboardModule {}
