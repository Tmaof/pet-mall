import { Public, ReqUser } from '@/decorator/index.decorator';
import { getCommonRes } from '@/utils';
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
        const data = await this.paymentService.createPayment(clientId, createPaymentDto);
        return getCommonRes({ data });
    }

    /** 获取支付状态 */
    @Get(':id/status')
    async getPaymentStatus (
    @ReqUser('clientId') clientId: number,
        @Param('id') paymentId: number,
        // 是否测试使用
        @Query('isTest') isTest: string
    ) {
        const data = await this.paymentService.getPaymentStatus(clientId, paymentId, isTest);
        return getCommonRes({ data });
    }

    /** 支付回调 */
    @Post('notify')
    @Public() // 标记为公开接口
    async paymentNotify (@Body() notifyData: NotifyData) {
        return await this.paymentService.handlePaymentNotify(notifyData);
    }
}
