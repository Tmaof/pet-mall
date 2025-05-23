import { Public, ReqUser } from '@/decorator/index.decorator';
import { JwtGuard } from '@/guards/jwt.guard';
import { getCommonRes } from '@/utils';
import {
    Body, Controller, Get, HttpCode, Param, Post, Query, UseGuards
} from '@nestjs/common';
import { CreatePaymentDto, NotifyData } from './req-dto';
import { PaymentService } from './service/payment.service';

@Controller('payments')
@UseGuards(JwtGuard)
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
    @Public() // 标记为公开接口
    @Post('notify')
    @HttpCode(200) // h5pay 成功的回调需要返回 200
    // async paymentNotify (@Body() notifyData: NotifyData) { // 不需要 ReqValidationPipe 验证，否则会缺少请求参数，导致签名校验失败
    async paymentNotify (@Body() notifyData:any) {
        const data = await this.paymentService.handlePaymentNotify(notifyData as NotifyData);
        return data;
    }
}
