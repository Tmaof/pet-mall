import { Address } from '@/modules/client/address/address.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product/product.entity';
import { AdminOrderController } from './controller/admin-order.controller';
import { OrderController } from './controller/client-order.controller';
import { OrderItem } from './entity/order-item.entity';
import { Order } from './entity/order.entity';
import { OrderService } from './service/order.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product, Address]),
    ],
    controllers: [OrderController, AdminOrderController],
    providers: [OrderService],
    exports: [OrderService],
})
export class OrderModule {}
