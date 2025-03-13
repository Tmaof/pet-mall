import { ReqUser, Public } from '@/decorator/index.decorator';
import {
    Body, Controller, Get, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePaymentDto, NotifyData } from './req-dto';
import { PaymentService } from './service/payment.service';

@Controller('payments')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
    constructor (private readonly paymentService: PaymentService) {}

    /** 创建支付 */
    @Post()
    async createPayment (
    @ReqUser('clientId') clientId: number,
        @Body() createPaymentDto: CreatePaymentDto
    ) {
        return this.paymentService.createPayment(clientId, createPaymentDto);
    }

    /** 获取支付状态 */
    @Get(':id/status')
    async getPaymentStatus (
    @ReqUser('clientId') clientId: number,
        @Param('id') paymentId: number,
        // 是否测试使用
        @Query('isTest') isTest: string
    ) {
        return this.paymentService.getPaymentStatus(clientId, paymentId, isTest);
    }

    /** 支付回调 */
    @Post('notify')
    @Public() // 标记为公开接口
    async paymentNotify (@Body() notifyData: NotifyData) {
        return await this.paymentService.handlePaymentNotify(notifyData);
    }
}
