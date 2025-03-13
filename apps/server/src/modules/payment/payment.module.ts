import { Order } from '@/modules/order/entity/order.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.entity';
import { H5payService } from './service/h5pay.service';
import { PaymentService } from './service/payment.service';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Order])],
    controllers: [PaymentController],
    providers: [PaymentService, H5payService],
    exports: [PaymentService],
})
export class PaymentModule {}
