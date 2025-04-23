import { OrderItem } from '@/modules/order/entity/order-item.entity';
import { Order } from '@/modules/order/entity/order.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, OrderItem]),
    ],
    controllers: [SalesController],
    providers: [SalesService],
    exports: [SalesService],
})
export class SalesAnalysisModule {}
