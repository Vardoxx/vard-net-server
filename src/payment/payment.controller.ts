import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { PaymentStatusDto } from './payment-status.dto'
import { PaymentDto } from './payment.dto'
import { PaymentService } from './payment.service'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get()
  @Auth()
  getAll(@CurrentUser('id') userId: string) {
    return this.paymentService.getAll(userId)
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  placeOrder(@Body() dto: PaymentDto, @CurrentUser('id') userId: string) {
    return this.paymentService.placePayment(userId, dto)
  }

  @HttpCode(200)
  @Post('status')
  async updateStatus(@Body() dto: PaymentStatusDto) {
    return this.paymentService.updateStatus(dto)
  }
}
