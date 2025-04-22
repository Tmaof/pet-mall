import { Address } from '@/modules/client/address/address.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/product/product.entity';
import { AdminOrderController } from './controller/admin-order.controller';
import { OrderController } from './controller/client-order.controller';
import { OrderItem } from './entity/order-item.entity';
import { Order } from './entity/order.entity';
import { ClientOrderService } from './service/client-order.service';
import { AdminOrderService } from './service/admin-order.service';
import { Client } from '@/modules/client/client/client.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem, Product, Address, Client]),
    ],
    controllers: [OrderController, AdminOrderController],
    providers: [ClientOrderService, AdminOrderService],
    exports: [ClientOrderService, AdminOrderService],
})
export class OrderModule {}
